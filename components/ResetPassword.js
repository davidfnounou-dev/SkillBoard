"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useLang, SUPABASE_ERROR_KEYS, SUPABASE_ERROR_CODES } from "@/lib/i18n";

// Shown when the person opens the "reset password" link from their email.
export default function ResetPassword({ onDone, tokenHash = null }) {
  const { t } = useLang();
  const [password, setPassword] = useState("");
  const [again, setAgain] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  // With a token_hash link we must confirm it (button press) before asking for the new password.
  const [verified, setVerified] = useState(!tokenHash);

  async function confirmLink() {
    setError("");
    setBusy(true);
    try {
      const { error: vErr } = await supabase.auth.verifyOtp({ type: "recovery", token_hash: tokenHash });
      if (vErr) { setError(t("auth.err.linkExpired")); return; }
      window.history.replaceState({}, "", window.location.pathname);
      setVerified(true);
    } finally {
      setBusy(false);
    }
  }

  const traducirError = (err) => {
    const key =
      (err && err.code && SUPABASE_ERROR_CODES[err.code]) ||
      SUPABASE_ERROR_KEYS[(err && err.message) || ""];
    return key ? t(key) : (err && err.message) || "";
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (password.length < 6) { setError(t("auth.err.passwordShort")); return; }
    if (password !== again) { setError(t("auth.passwordMismatch")); return; }
    setBusy(true);
    try {
      const { error: upErr } = await supabase.auth.updateUser({ password });
      if (upErr) { setError(traducirError(upErr)); return; }
      setDone(true);
    } finally {
      setBusy(false);
    }
  }

  if (!verified) {
    return (
      <section className="auth-card">
        <div className="auth-forgot-head">
          <h2>{t("auth.newPasswordTitle")}</h2>
        </div>
        <div className="auth-form">
          <p className="auth-error" role="alert">{error}</p>
          <button className="btn btn-primary btn-block" onClick={confirmLink} disabled={busy}>
            {busy ? t("auth.wait") : t("auth.continueReset")}
          </button>
        </div>
      </section>
    );
  }

  if (done) {
    return (
      <section className="auth-card">
        <div className="auth-forgot-head">
          <h2>✓ {t("auth.passwordUpdated")}</h2>
        </div>
        <div className="auth-form">
          <button className="btn btn-primary btn-block" onClick={onDone}>
            {t("auth.goToBoard")}
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="auth-card">
      <div className="auth-forgot-head">
        <h2>{t("auth.newPasswordTitle")}</h2>
      </div>
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="newPass">{t("auth.newPassword")}</label>
          <input
            id="newPass"
            type="password"
            placeholder={t("auth.passwordPlaceholder")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            required
          />
        </div>
        <div className="field">
          <label htmlFor="newPass2">{t("auth.confirmPassword")}</label>
          <input
            id="newPass2"
            type="password"
            value={again}
            onChange={(e) => setAgain(e.target.value)}
            autoComplete="new-password"
            required
          />
        </div>
        <p className="auth-error" role="alert">{error}</p>
        <button type="submit" className="btn btn-primary btn-block" disabled={busy}>
          {busy ? t("auth.wait") : t("auth.savePassword")}
        </button>
      </form>
    </section>
  );
}
