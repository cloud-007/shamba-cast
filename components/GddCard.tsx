import type { GddSeries } from "@/lib/types";

export function GddCard({ gdd }: { gdd: GddSeries }) {
  const w = 100;
  const h = 36;
  const max = Math.max(1, ...gdd.days.map((d) => d.accumulated));
  const pts = gdd.days
    .map(
      (d, i) =>
        `${(i / Math.max(1, gdd.days.length - 1)) * w},${h - (d.accumulated / max) * (h - 4)}`
    )
    .join(" ");

  return (
    <section className="flex flex-col gap-6 rounded-3xl border border-maize/40 bg-maize/5 p-6 sm:flex-row sm:items-center">
      <div className="sm:w-1/2">
        <p className="font-body text-xs font-semibold uppercase tracking-[0.16em] text-maize-deep">
          ☀️ Crop heat this week
        </p>
        <p className="mt-2 font-display text-5xl font-light text-ink">
          {Math.round(gdd.total)}
          <span className="ml-2 font-body text-sm text-ink-soft">heat units</span>
        </p>
        <p className="mt-2 font-body text-sm leading-relaxed text-ink-soft">
          The warmth your crops have soaked up. More heat means faster growth — handy for guessing
          when maize will be ready.
        </p>
      </div>
      <div className="sm:w-1/2">
        <svg
          viewBox={`0 0 ${w} ${h}`}
          className="h-20 w-full overflow-visible"
          preserveAspectRatio="none"
          aria-hidden
        >
          <polyline
            points={pts}
            fill="none"
            stroke="var(--color-maize-deep)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={
              {
                strokeDasharray: 260,
                strokeDashoffset: 260,
                animation: "draw 1.2s ease-out 0.15s both",
                "--len": "260",
              } as React.CSSProperties
            }
          />
        </svg>
        <p className="mt-1 text-right font-body text-xs text-ink-soft">
          counted over {gdd.days.length} days
        </p>
      </div>
    </section>
  );
}
