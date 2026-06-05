import type { AdvisoryReport, AdvisoryStatus } from "@/lib/types";
const COLOR: Record<AdvisoryStatus, string> = {
  good: "border-emerald-300 bg-emerald-50", caution: "border-amber-300 bg-amber-50",
  avoid: "border-red-300 bg-red-50", info: "border-gray-200 bg-gray-50",
};
export function AdvisoryPanel({ report }: { report: AdvisoryReport }) {
  return (
    <section>
      <h2 className="mb-2 font-semibold">Farm advisory</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {report.items.map((i, idx) => (
          <div key={idx} className={`rounded-xl border p-3 ${COLOR[i.status]}`}>
            <p className="font-semibold capitalize">{i.title}</p>
            {i.dayRange && <p className="text-xs text-gray-500">{i.dayRange}</p>}
            <p className="mt-1 text-sm text-gray-700">{i.reason}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
