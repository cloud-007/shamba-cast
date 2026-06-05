export function AiSummaryPanel({ summary }: { summary?: string }) {
  return (
    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
      <p className="mb-1 text-sm font-semibold text-emerald-700">📋 Forecast briefing</p>
      <p className="text-sm text-emerald-900">{summary ?? "No briefing available."}</p>
      <p className="mt-2 text-[10px] text-emerald-700/70">
        Auto-generated locally. Weather-AI's AI narrative is a Pro-tier feature.
      </p>
    </div>
  );
}
