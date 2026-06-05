import type { HourForecast, Units } from "@/lib/types";
import { conditionEmoji } from "@/lib/condition-icon";
import { SectionTitle } from "@/components/SectionTitle";

export function HourlyStrip({ hours, units }: { hours: HourForecast[]; units: Units }) {
  if (!hours.length) return null;
  const u = units === "metric" ? "°" : "°";
  return (
    <section>
      <SectionTitle kicker="Today" title="Hour by hour" />
      <div className="flex gap-2.5 overflow-x-auto pb-2">
        {hours.map((h) => (
          <div
            key={h.time}
            className="flex min-w-[68px] flex-col items-center rounded-2xl border border-line bg-paper/70 p-2.5 text-center"
          >
            <span className="font-body text-xs text-ink-soft">{h.time.slice(11, 16)}</span>
            <span className="my-1 text-xl" aria-hidden>
              {conditionEmoji(h.condition)}
            </span>
            <span className="font-display text-base font-semibold text-ink">
              {Math.round(h.temp)}
              {u}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
