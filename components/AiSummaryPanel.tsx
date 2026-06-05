export function AiSummaryPanel({ summary }: { summary?: string }) {
  return (
    <section className="flex h-full flex-col justify-center rounded-3xl border border-leaf/30 bg-leaf/5 p-6">
      <p className="flex items-center gap-2 font-body text-xs font-semibold uppercase tracking-[0.16em] text-leaf-deep">
        <span aria-hidden>🌱</span> In a nutshell
      </p>
      <p className="mt-3 font-display text-xl leading-relaxed text-ink">
        {summary ?? "No briefing yet — pick your area above."}
      </p>
      <p className="mt-4 font-body text-xs text-ink-soft">
        Written for you from this week’s forecast.
      </p>
    </section>
  );
}
