export function AiSummaryPanel({ summary }: { summary?: string }) {
  return (
    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
      <p className="mb-1 text-sm font-semibold text-emerald-700">🤖 AI summary</p>
      <p className="text-sm text-emerald-900">{summary ?? "No AI summary available."}</p>
    </div>
  );
}
