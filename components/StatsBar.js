"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/lib/i18n";
import { roughCount } from "@/lib/helpers";

// Anima un número de 0 hasta su valor (respeta "reducir movimiento").
function useCountUp(target, duration = 900) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let reduce = false;
    try {
      reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch (_) {}
    if (reduce || target <= 0) { setValue(target); return; }
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
}

function Stat({ icon, target, label, format }) {
  const v = useCountUp(target);
  return (
    <div className="stat">
      <div className="stat-value">
        <span aria-hidden="true" className="stat-icon">{icon}</span>
        {format(v, target)}
      </div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

// Barra de datos. Todos los números salen de la base de datos real:
// si todavía no hay suficientes datos de algo, ese dato no se muestra.
export default function StatsBar({ stats }) {
  const { t } = useLang();
  if (!stats || stats.pros < 1) return null;

  // Mientras cuenta, mostramos el número tal cual; al final, el número redondeado hacia abajo ("130+").
  const countFormat = (v, target) => (v >= target ? roughCount(target) : String(v));

  return (
    <section className="stats-bar" aria-label="Estadísticas">
      <Stat icon="👥" target={stats.pros} label={t("stats.pros")} format={countFormat} />
      {stats.professions >= 2 && (
        <Stat icon="🧰" target={stats.professions} label={t("stats.professions")} format={countFormat} />
      )}
      {stats.zones >= 2 && (
        <Stat icon="📍" target={stats.zones} label={t("stats.zones")} format={countFormat} />
      )}
      {stats.reviews >= 1 && (
        <Stat icon="💬" target={stats.reviews} label={t("stats.reviews")} format={countFormat} />
      )}
      {stats.reviews >= 3 && (
        <div className="stat">
          <div className="stat-value">
            <span aria-hidden="true" className="stat-icon">⭐</span>
            {stats.avg.toFixed(1)}
          </div>
          <div className="stat-label">{t("stats.rating")}</div>
        </div>
      )}
    </section>
  );
}
