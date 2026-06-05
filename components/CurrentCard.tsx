import type { Forecast } from "@/lib/types";
export function CurrentCard({ forecast }: { forecast: Forecast }) {
  const u = forecast.units === "metric" ? "°C" : "°F";
  const c = forecast.current;
  return (
    <div className="rounded-xl border p-4">
      <p className="text-sm text-gray-500">{forecast.location}</p>
      <p className="text-4xl font-bold">{Math.round(c.temp)}{u}</p>
      <p className="text-gray-700">{c.condition}</p>
      <div className="mt-2 text-sm text-gray-500 space-x-3">
        {c.humidity !== undefined && <span>💧 {c.humidity}%</span>}
        {c.windKph !== undefined && <span>🌬 {c.windKph} kph</span>}
      </div>
    </div>
  );
}
