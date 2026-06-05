import type { DayForecast, GddSeries, Units } from "@/lib/types";

export function computeGdd(days: DayForecast[], base = 10, units: Units = "metric"): GddSeries {
  let acc = 0;
  const out = days.map((d) => {
    const mean = (d.high + d.low) / 2;
    const gdd = Math.max(0, mean - base);
    acc += gdd;
    return { date: d.date, gdd, accumulated: acc };
  });
  return { base, units, days: out, total: acc };
}
