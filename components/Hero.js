"use client";

import { useLang } from "@/lib/i18n";

// Portada: dos caminos claros — cliente (busca) o profesional (ofrece su servicio).
export default function Hero({ currentUser, onClient, onPro, onLogin, onExplore, onSearch, onOffer }) {
  const { t } = useLang();

  return (
    <header className="hero2">
      <span className="hero2-eyebrow">{t("hero.eyebrow")}</span>
      <h1>{t("hero.title")}</h1>
      <p>{t("hero.sub")}</p>

      <div className="role-row">
        {currentUser ? (
          <>
            <button className="role-btn client" onClick={onSearch}>
              <span className="role-icon" aria-hidden="true">🔍</span>
              <span>
                <span className="role-title">{t("hero.loggedSearch")}</span>
                <span className="role-sub">{t("hero.loggedSearchSub")}</span>
              </span>
            </button>
            <button className="role-btn pro" onClick={onOffer}>
              <span className="role-icon" aria-hidden="true">🛠️</span>
              <span>
                <span className="role-title">{t("hero.loggedOffer")}</span>
                <span className="role-sub">{t("hero.loggedOfferSub")}</span>
              </span>
            </button>
          </>
        ) : (
          <>
            <button className="role-btn client" onClick={onClient}>
              <span className="role-icon" aria-hidden="true">🔍</span>
              <span>
                <span className="role-title">{t("hero.client")}</span>
                <span className="role-sub">{t("hero.clientSub")}</span>
              </span>
            </button>
            <button className="role-btn pro" onClick={onPro}>
              <span className="role-icon" aria-hidden="true">🛠️</span>
              <span>
                <span className="role-title">{t("hero.pro")}</span>
                <span className="role-sub">{t("hero.proSub")}</span>
              </span>
            </button>
          </>
        )}
      </div>

      {!currentUser && (
        <p className="hero2-links">
          {t("hero.haveAccount")}{" "}
          <button type="button" onClick={onLogin}>{t("header.login")}</button>
          <span aria-hidden="true"> · </span>
          <button type="button" onClick={onExplore}>{t("hero.explore")}</button>
        </p>
      )}
    </header>
  );
}
