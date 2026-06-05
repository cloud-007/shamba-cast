import type { DayForecast, Units } from "@/lib/types";
import { conditionEmoji } from "@/lib/condition-icon";
import { SectionTitle } from "@/components/SectionTitle";

function dayLabel(date: string): string {
  const d = new Date(`${date}T00:00:00`);
  return Number.isNaN(d.getTime())
    ? date.slice(5)
    : d.toLocaleDateString("en-US", { weekday: "short" });
}

export function ForecastStrip({ days, units }: { days: DayForecast[]; units: Units }) {
  if (!days.length) return null;
  const u = units === "metric" ? "°" : "°";
  return (
    <section>
      <SectionTitle kicker="Outlook" title="The week ahead" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        {days.map((d, idx) => (
          <div
            key={d.date}
            className="reveal rounded-2xl border border-line bg-paper/70 p-3 text-center shadow-sm"
            style={{ animationDelay: `${idx * 55}ms` }}
          >
            <p className="font-body text-xs font-semibold uppercase tracking-wide text-ink-soft">
              {dayLabel(d.date)}
            </p>
            <p className="my-1 text-3xl" aria-hidden>
              {conditionEmoji(d.condition)}
            </p>
            <p className="font-display text-lg font-semibold text-ink">
              {Math.round(d.high)}
              {u}
            </p>
            <p className="font-body text-sm text-ink-soft">
              {Math.round(d.low)}
              {u}
            </p>
            {d.precipMm !== undefined && d.precipMm > 0 && (
              <p className="mt-1 font-body text-[11px] text-sky">💧 {d.precipMm} mm</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
