import type { HourForecast, Units } from "@/lib/types";
export function HourlyStrip({ hours, units }: { hours: HourForecast[]; units: Units }) {
  if (!hours.length) return null;
  const u = units === "metric" ? "°C" : "°F";
  return (
    <section>
      <h2 className="mb-2 font-semibold">Hourly</h2>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {hours.map(h => (
          <div key={h.time} className="min-w-16 rounded-lg border p-2 text-center text-xs">
            <p className="text-gray-500">{h.time.slice(11, 16)}</p>
            <p className="font-semibold">{Math.round(h.temp)}{u}</p>
            <p className="truncate">{h.condition}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
