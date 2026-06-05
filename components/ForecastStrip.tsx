import type { DayForecast, Units } from "@/lib/types";
export function ForecastStrip({ days, units }: { days: DayForecast[]; units: Units }) {
  const u = units === "metric" ? "°" : "°";
  return (
    <section>
      <h2 className="mb-2 font-semibold">7-day forecast</h2>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
        {days.map(d => (
          <div key={d.date} className="rounded-lg border p-2 text-center text-sm">
            <p className="text-gray-500">{d.date.slice(5)}</p>
            <p className="font-semibold">{Math.round(d.high)}{u}</p>
            <p className="text-gray-500">{Math.round(d.low)}{u}</p>
            <p className="truncate text-xs">{d.condition}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
