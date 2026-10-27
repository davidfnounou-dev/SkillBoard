// Make initials for an avatar, e.g. "Jackie Mensah" -> "JM"
export function initials(name) {
  if (!name) return "?";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

// How long someone has been on the app, in words: "5 meses en la app".
// `t` is the translate function from useLang().
export function tenureLabel(createdAt, t) {
  if (!createdAt) return "";
  const time = new Date(createdAt).getTime();
  if (Number.isNaN(time)) return "";
  const days = Math.floor((Date.now() - time) / 86400000);
  if (days < 1) return t("tenure.today");
  if (days < 30) return t(days === 1 ? "tenure.dayOne" : "tenure.dayMany", { n: days });
  const months = Math.max(1, Math.floor(days / 30.44));
  if (months < 12) return t(months === 1 ? "tenure.monthOne" : "tenure.monthMany", { n: months });
  const years = Math.floor(months / 12);
  return t(years === 1 ? "tenure.yearOne" : "tenure.yearMany", { n: years });
}

// Show big numbers honestly rounded down: 7 -> "7", 134 -> "130+", 1260 -> "1,250+"
export function roughCount(n) {
  if (n < 20) return String(n);
  if (n < 100) return `${Math.floor(n / 10) * 10}+`;
  if (n < 1000) return `${Math.floor(n / 50) * 50}+`;
  return `${(Math.floor(n / 250) * 250).toLocaleString("en-US")}+`;
}

// Short date like "12 oct 2026" in the active language.
export function shortDate(iso, lang) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(lang === "en" ? "en-US" : "es-PA", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
