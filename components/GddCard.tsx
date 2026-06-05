import type { GddSeries } from "@/lib/types";
export function GddCard({ gdd }: { gdd: GddSeries }) {
  const max = Math.max(1, ...gdd.days.map(d => d.accumulated));
  const pts = gdd.days.map((d, i) =>
    `${(i / Math.max(1, gdd.days.length - 1)) * 100},${30 - (d.accumulated / max) * 28}`).join(" ");
  return (
    <div className="rounded-xl border p-4">
      <p className="text-sm font-semibold">Growing degree days</p>
      <p className="text-3xl font-bold">{gdd.total}<span className="text-base text-gray-400"> GDD</span></p>
      <svg viewBox="0 0 100 30" className="mt-2 h-10 w-full">
        <polyline points={pts} fill="none" stroke="#059669" strokeWidth="2" />
      </svg>
      <p className="text-xs text-gray-400">Base {gdd.base}° (maize), over {gdd.days.length} days.</p>
    </div>
  );
}
