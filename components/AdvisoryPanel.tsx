import type { AdvisoryItem, AdvisoryReport, AdvisoryStatus } from "@/lib/types";
import { SectionTitle } from "@/components/SectionTitle";

const ICON: Record<AdvisoryItem["kind"], string> = {
  plant: "🌱",
  spray: "🧴",
  harvest: "🌾",
  frost: "❄️",
  rain: "🌧️",
};

const STATUS: Record<AdvisoryStatus, { word: string; box: string; dot: string }> = {
  good: { word: "Go ahead", box: "border-leaf/40 bg-leaf/5", dot: "bg-leaf" },
  caution: { word: "Take care", box: "border-maize/50 bg-maize/10", dot: "bg-maize-deep" },
  avoid: { word: "Hold off", box: "border-terracotta/40 bg-terracotta/10", dot: "bg-terracotta" },
  info: { word: "Note", box: "border-line bg-paper-2", dot: "bg-ink-soft" },
};

export function AdvisoryPanel({ report }: { report: AdvisoryReport }) {
  return (
    <section>
      <SectionTitle kicker="Your farm" title="What to do" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {report.items.map((i) => {
          const s = STATUS[i.status];
          return (
            <article
              key={i.kind}
              className={`rounded-2xl border p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md ${s.box}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-3xl" aria-hidden>
                  {ICON[i.kind]}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-paper/80 px-2.5 py-1 font-body text-xs font-semibold text-ink">
                  <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
                  {s.word}
                </span>
              </div>
              <h3 className="mt-3 font-display text-lg font-semibold text-ink">{i.title}</h3>
              {i.dayRange && (
                <p className="font-body text-xs text-ink-soft">{i.dayRange}</p>
              )}
              <p className="mt-1.5 font-body text-sm leading-relaxed text-ink-soft">{i.reason}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
