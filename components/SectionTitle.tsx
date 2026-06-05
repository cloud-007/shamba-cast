export function SectionTitle({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div className="mb-4 flex items-baseline gap-3">
      <span className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-maize-deep">
        {kicker}
      </span>
      <h2 className="font-display text-2xl font-semibold text-ink">{title}</h2>
      <span className="h-px flex-1 bg-line" />
    </div>
  );
}
