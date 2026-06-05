import type { Forecast } from "@/lib/types";
import { conditionEmoji, conditionPlain } from "@/lib/condition-icon";

export function CurrentCard({ forecast }: { forecast: Forecast }) {
  const u = forecast.units === "metric" ? "°C" : "°F";
  const wUnit = forecast.units === "metric" ? "km/h" : "mph";
  const c = forecast.current;
  return (
    <section className="relative h-full overflow-hidden rounded-3xl border border-line bg-gradient-to-br from-paper to-paper-2 p-6 shadow-[0_18px_44px_-24px_rgba(42,32,20,0.55)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-body text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft">
            Right now in
          </p>
          <h2 className="font-display text-3xl font-semibold leading-tight text-ink">
            {forecast.location}
          </h2>
        </div>
        <span className="text-6xl leading-none" aria-hidden>
          {conditionEmoji(c.condition)}
        </span>
      </div>

      <div className="mt-5 flex items-end gap-4">
        <span className="font-display text-7xl font-light leading-none text-ink">
          {Math.round(c.temp)}
          <span className="align-top text-3xl text-ink-soft">{u}</span>
        </span>
        <span className="mb-2 rounded-full bg-soil/5 px-3 py-1 font-body text-base font-medium text-ink">
          {conditionPlain(c.condition)}
        </span>
      </div>

      <div className="mt-6 flex flex-wrap gap-2 font-body text-sm">
        {c.humidity !== undefined && <Chip>💧 {c.humidity}% humidity</Chip>}
        {c.windKph !== undefined && (
          <Chip>
            🌬️ {Math.round(c.windKph)} {wUnit} wind
          </Chip>
        )}
        {c.windKph === undefined && c.humidity === undefined && (
          <Chip>Conditions updated from Weather-AI</Chip>
        )}
      </div>
    </section>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-line bg-paper/70 px-3 py-1 text-ink-soft">
      {children}
    </span>
  );
}
