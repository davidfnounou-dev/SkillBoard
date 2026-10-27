"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useLang, SUPABASE_ERROR_KEYS, SUPABASE_ERROR_CODES } from "@/lib/i18n";

// mode: "login" | "signup" | "forgot"
export default function AuthForm({ mode, setMode, initialIntent = "client", onLoggedIn, onSignedUp }) {
  const { t } = useLang();

  // Translate Supabase (English) errors into the active language.
  const traducirError = (err) => {
    const code = err && err.code;
    const msg = (err && err.message) || "";
    const key =
      (code && SUPABASE_ERROR_CODES[code]) ||
      SUPABASE_ERROR_KEYS[msg] ||
      (/security purposes|rate limit/i.test(msg) ? "auth.err.rateLimit" : null);
    return key ? t(key) : msg;
  };
  const isDuplicate = (err) =>
    err && (err.code === "user_already_exists" || err.code === "email_exists" || err.message === "User already registered");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [intent, setIntent] = useState(initialIntent); // "client" | "professional"
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [duplicate, setDuplicate] = useState(false);
  const [busy, setBusy] = useState(false);

  function switchMode(next) {
    setMode(next);
    setError("");
    setNotice("");
    setDuplicate(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setNotice("");
    setDuplicate(false);
    setBusy(true);

    try {
      if (mode === "signup") {
        if (!name.trim()) {
          setError(t("auth.enterName"));
          return;
        }
        // The name travels as user metadata so the DB trigger (schema.sql)
        // can create the profile row even if the client step below fails.
        const { data, error: signErr } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { data: { name: name.trim(), intent } },
        });
        if (signErr) {
          setError(traducirError(signErr));
          setDuplicate(isDuplicate(signErr));
          return;
        }

        // When email confirmation is ON, Supabase does NOT return an error for an
        // email that already exists (to protect privacy). It returns a fake user
        // with an empty "identities" list. That is how we detect a repeated email.
        if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
          setError(t("auth.err.userExists"));
          setDuplicate(true);
          return;
        }

        // Email confirmation is ON and this is a brand new account: no session yet.
        if (!data.session) {
          setNotice(t("auth.checkEmail"));
          return;
        }

        // Upsert (not insert): the trigger may already have created the row.
        const { error: pErr } = await supabase
          .from("profiles")
          .upsert({ id: data.user.id, name: name.trim() });
        if (pErr) { setError(traducirError(pErr)); return; }

        await onSignedUp(intent);
      } else if (mode === "forgot") {
        const { error: resetErr } = await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: window.location.origin,
        });
        if (resetErr) { setError(traducirError(resetErr)); return; }
        // Same message whether or not the email exists (so nobody can probe accounts).
        setNotice(t("auth.linkSent"));
      } else {
        const { error: loginErr } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (loginErr) { setError(traducirError(loginErr)); return; }
        await onLoggedIn();
      }
    } finally {
      setBusy(false);
    }
  }

  const submitLabel = busy
    ? t("auth.wait")
    : mode === "signup"
    ? t("auth.createAccount")
    : mode === "forgot"
    ? t("auth.sendLink")
    : t("auth.login");

  return (
    <section className="auth-card">
      {mode === "forgot" ? (
        <div className="auth-forgot-head">
          <h2>{t("auth.forgotTitle")}</h2>
          <p>{t("auth.forgotHelp")}</p>
        </div>
      ) : (
        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab ${mode === "login" ? "active" : ""}`}
            onClick={() => switchMode("login")}
          >
            {t("auth.tab.login")}
          </button>
          <button
            type="button"
            className={`auth-tab ${mode === "signup" ? "active" : ""}`}
            onClick={() => switchMode("signup")}
          >
            {t("auth.tab.signup")}
          </button>
        </div>
      )}

      <form className="auth-form" onSubmit={handleSubmit}>
        {mode === "signup" && (
          <>
            <div className="field">
              <label>{t("auth.iWant")}</label>
              <div className="intent-toggle" role="radiogroup" aria-label={t("auth.iWant")}>
                <button
                  type="button"
                  role="radio"
                  aria-checked={intent === "client"}
                  className={`intent-btn ${intent === "client" ? "active" : ""}`}
                  onClick={() => setIntent("client")}
                >
                  🔍 {t("auth.intentClient")}
                </button>
                <button
                  type="button"
                  role="radio"
                  aria-checked={intent === "professional"}
                  className={`intent-btn ${intent === "professional" ? "active" : ""}`}
                  onClick={() => setIntent("professional")}
                >
                  🛠️ {t("auth.intentPro")}
                </button>
              </div>
            </div>
            <div className="field">
              <label htmlFor="authName">{t("auth.name")}</label>
              <input
                id="authName"
                type="text"
                placeholder={t("auth.namePlaceholder")}
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
            </div>
          </>
        )}
        <div className="field">
          <label htmlFor="authEmail">{t("auth.email")}</label>
          <input
            id="authEmail"
            type="email"
            placeholder={t("auth.emailPlaceholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </div>
        {mode !== "forgot" && (
          <div className="field">
            <label htmlFor="authPassword">{t("auth.password")}</label>
            <input
              id="authPassword"
              type="password"
              placeholder={t("auth.passwordPlaceholder")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              required
            />
          </div>
        )}

        {mode === "login" && (
          <button type="button" className="link-btn forgot-link" onClick={() => switchMode("forgot")}>
            {t("auth.forgot")}
          </button>
        )}

        <p className="auth-error" role="alert">{error}</p>
        {duplicate && (
          <div className="auth-dup-actions">
            <button type="button" className="btn btn-ghost btn-small" onClick={() => switchMode("login")}>
              {t("auth.login")}
            </button>
            <button type="button" className="btn btn-ghost btn-small" onClick={() => switchMode("forgot")}>
              {t("auth.forgot")}
            </button>
          </div>
        )}
        {notice && <p className="auth-notice" role="status">{notice}</p>}

        <button type="submit" className="btn btn-primary btn-block" disabled={busy}>
          {submitLabel}
        </button>

        {mode === "forgot" && (
          <button type="button" className="link-btn back-link" onClick={() => switchMode("login")}>
            {t("auth.backToLogin")}
          </button>
        )}
      </form>
    </section>
  );
}
