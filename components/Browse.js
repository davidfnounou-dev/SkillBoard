"use client";

import { useState, useMemo } from "react";
import Avatar from "@/components/Avatar";
import { useLang } from "@/lib/i18n";
import { phon, textMatches, skillMatches, skillLabel, suggestSkills, ZONES } from "@/lib/skills";
import { tenureLabel } from "@/lib/helpers";

const MAX_TAGS = 4;

function stars(avg) {
  const rounded = Math.round(avg);
  return "★★★★★".slice(0, rounded) + "☆☆☆☆☆".slice(0, 5 - rounded);
}

// Bold the part of the suggestion the person already typed.
function Highlight({ label, query }) {
  const q = query.trim();
  if (q && label.toLowerCase().startsWith(q.toLowerCase())) {
    return (
      <>
        <strong>{label.slice(0, q.length)}</strong>
        {label.slice(q.length)}
      </>
    );
  }
  return label;
}

export default function Browse({ profiles, onOpenProfile }) {
  const { t, lang } = useLang();
  const [query, setQuery] = useState("");
  const [place, setPlace] = useState("");
  const [sortBy, setSortBy] = useState("recent"); // "recent" | "rating"
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);

  // "Flexible" versions of what was typed: no accents, no double letters, tolerant spelling.
  const qKey = useMemo(() => phon(query), [query]);
  const locKey = useMemo(() => phon(place), [place]);

  // Only people with at least one skill appear on the board.
  const pros = useMemo(() => profiles.filter((p) => (p.skills || []).length > 0), [profiles]);

  const list = useMemo(() => {
    let out = pros;
    // Search matches a skill (in Spanish OR English, with typos) OR the person's name.
    if (qKey) {
      out = out.filter(
        (p) =>
          textMatches(qKey, p.name || "") ||
          p.skills.some((s) => skillMatches(s.skill_name, qKey))
      );
    }
    if (locKey) {
      out = out.filter((p) => textMatches(locKey, p.location || ""));
    }
    if (sortBy === "rating") {
      out = [...out].sort((a, b) => b.avgRating - a.avgRating || b.ratingCount - a.ratingCount);
    }
    return out;
  }, [pros, qKey, locKey, sortBy]);

  // ---------- Suggestions while typing (like YouTube) ----------
  const boardSkills = useMemo(() => pros.flatMap((p) => p.skills.map((s) => s.skill_name)), [pros]);

  const skillSuggestions = useMemo(
    () => suggestSkills(query, lang, boardSkills, 6),
    [query, lang, boardSkills]
  );

  const peopleSuggestions = useMemo(() => {
    if (qKey.length < 2) return [];
    return pros
      .filter((p) => phon(p.name || "").split(" ").some((w) => w.startsWith(qKey)))
      .slice(0, 2);
  }, [pros, qKey]);

  const items = [
    ...skillSuggestions.map((s) => ({ kind: "skill", key: `s-${s.id}`, ...s })),
    ...peopleSuggestions.map((p) => ({ kind: "person", key: `p-${p.id}`, id: p.id, label: p.name, profile: p })),
  ];
  const showList = open && items.length > 0;

  function choose(item) {
    setOpen(false);
    setActive(-1);
    if (item.kind === "skill") setQuery(item.label);
    else onOpenProfile(item.id);
  }

  function onKeyDown(e) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive((a) => (items.length ? (a + 1) % items.length : -1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setOpen(true);
      setActive((a) => (items.length ? (a <= 0 ? items.length - 1 : a - 1) : -1));
    } else if (e.key === "Enter") {
      if (showList && active >= 0) {
        e.preventDefault();
        choose(items[active]);
      } else {
        setOpen(false);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      setActive(-1);
    }
  }

  const zoneOptions = useMemo(() => {
    const seen = new Set();
    const out = [];
    [...pros.map((p) => (p.location || "").trim()), ...ZONES].forEach((z) => {
      const k = phon(z);
      if (z && !seen.has(k)) { seen.add(k); out.push(z); }
    });
    return out;
  }, [pros]);

  const meta =
    qKey || locKey
      ? t(list.length === 1 ? "browse.resultsOne" : "browse.resultsMany", { count: list.length })
      : t(list.length === 1 ? "browse.peopleOne" : "browse.peopleMany", { count: list.length });

  const listHeader = !qKey ? t("browse.suggestPopular") : t("browse.suggestSkills");

  return (
    <section id="tablero" className="board">
      <div className="browse-head">
        <h2 className="section-title">{t("browse.title")}</h2>
        <div className="search-wrap">
          <div className="search-box">
            <span className="search-icon" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
            </span>
            <input
              id="searchInput"
              type="text"
              className="search-input search-main"
              placeholder={t("browse.searchPlaceholder")}
              value={query}
              autoComplete="off"
              role="combobox"
              aria-expanded={showList}
              aria-controls="suggest-list"
              aria-autocomplete="list"
              aria-activedescendant={active >= 0 ? `sug-${active}` : undefined}
              onChange={(e) => { setQuery(e.target.value); setOpen(true); setActive(-1); }}
              onFocus={() => setOpen(true)}
              onBlur={() => setTimeout(() => setOpen(false), 120)}
              onKeyDown={onKeyDown}
            />
            {query && (
              <button
                type="button"
                className="search-clear"
                aria-label={t("browse.clear")}
                title={t("browse.clear")}
                onMouseDown={(e) => { e.preventDefault(); setQuery(""); setActive(-1); setOpen(true); }}
              >
                ×
              </button>
            )}

            {showList && (
              <ul id="suggest-list" className="suggest-list" role="listbox">
                {items.map((item, i) => {
                  const firstSkill = i === 0 && item.kind === "skill";
                  const firstPerson = item.kind === "person" && (i === 0 || items[i - 1].kind !== "person");
                  return (
                    <li key={item.key} role="presentation">
                      {firstSkill && <div className="suggest-head">{listHeader}</div>}
                      {firstPerson && <div className="suggest-head">{t("browse.suggestPeople")}</div>}
                      <div
                        id={`sug-${i}`}
                        role="option"
                        aria-selected={i === active}
                        className={`suggest-item ${i === active ? "active" : ""}`}
                        onMouseDown={(e) => { e.preventDefault(); choose(item); }}
                        onMouseEnter={() => setActive(i)}
                      >
                        {item.kind === "person" ? (
                          <>
                            <span className="suggest-label">
                              <Avatar name={item.label} photoUrl={item.profile.photo_url} className="avatar-xs" />
                              <Highlight label={item.label} query={query} />
                            </span>
                            <span className="suggest-count">{item.profile.location || ""}</span>
                          </>
                        ) : (
                          <>
                            <span className="suggest-label">
                              <span className="suggest-glyph" aria-hidden="true">🔎</span>
                              <Highlight label={item.label} query={query} />
                            </span>
                            <span className="suggest-count">
                              {item.count > 0
                                ? t(item.count === 1 ? "browse.suggestCountOne" : "browse.suggestCountMany", { count: item.count })
                                : t("browse.suggestNone")}
                            </span>
                          </>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="filter-row">
            <input
              type="text"
              className="search-input"
              list="zones-list"
              placeholder={t("browse.locationPlaceholder")}
              value={place}
              onChange={(e) => setPlace(e.target.value)}
            />
            <datalist id="zones-list">
              {zoneOptions.map((z) => <option key={z} value={z} />)}
            </datalist>
            <select
              className="search-input sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="recent">{t("browse.sortRecent")}</option>
              <option value="rating">{t("browse.sortRating")}</option>
            </select>
          </div>
        </div>
      </div>

      <div className="results-meta" aria-live="polite">{meta}</div>

      <div className="card-grid">
        {list.length === 0 ? (
          <p className="empty-state">
            {qKey || locKey ? t("browse.noMatch") : t("browse.empty")}
          </p>
        ) : (
          list.map((p) => {
            // Translate each trade into the active language, without repeats.
            const labels = [];
            p.skills.forEach((s) => {
              const label = skillLabel(s.skill_name, lang);
              if (!labels.some((l) => l.label === label)) {
                labels.push({ id: s.id, label, match: !!qKey && skillMatches(s.skill_name, qKey) });
              }
            });
            // Make sure a matching trade is never hidden behind "+N more".
            const ordered = [...labels].sort((a, b) => Number(b.match) - Number(a.match));
            const shown = ordered.slice(0, MAX_TAGS);
            const hidden = ordered.length - shown.length;
            const tenure = tenureLabel(p.created_at, t);

            return (
              <article
                key={p.id}
                className="profile-card"
                tabIndex={0}
                onClick={() => onOpenProfile(p.id)}
                onKeyDown={(e) => { if (e.key === "Enter") onOpenProfile(p.id); }}
              >
                <div className="card-top">
                  <Avatar name={p.name} photoUrl={p.photo_url} />
                  <div className="card-who">
                    <div className="card-name">{p.name}</div>
                    {p.location && <div className="card-location">📍 {p.location}</div>}
                  </div>
                </div>

                <div className="card-rating">
                  {p.ratingCount > 0 ? (
                    <>
                      <span className="stars-display">{stars(p.avgRating)}</span>
                      <span className="card-rating-num">{p.avgRating.toFixed(1)}</span>
                      <span className="card-rating-count">
                        · {t(p.ratingCount === 1 ? "card.reviewsOne" : "card.reviewsMany", { count: p.ratingCount })}
                      </span>
                    </>
                  ) : (
                    <span className="card-rating-count">{t("card.noReviews")}</span>
                  )}
                </div>

                {p.bio && <p className="card-bio">{p.bio}</p>}

                <div className="skill-tags">
                  {shown.map((s) => (
                    <span key={s.id} className={`skill-tag ${s.match ? "match" : ""}`}>
                      {s.label}
                    </span>
                  ))}
                  {hidden > 0 && <span className="skill-tag more">{t("card.moreSkills", { n: hidden })}</span>}
                </div>

                {p.latestReview && (
                  <blockquote className="card-review">
                    &ldquo;{p.latestReview.text}&rdquo;
                    {p.latestReview.name && <cite>— {p.latestReview.name}</cite>}
                  </blockquote>
                )}

                <div className="card-foot">
                  <span className="tenure">{tenure ? `🕒 ${tenure}` : ""}</span>
                  <span className="card-link">{t("card.viewProfile")}</span>
                </div>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}
