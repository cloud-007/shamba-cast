import type { NormalizedResponse } from "@/lib/types";
import { computeGdd } from "@/lib/gdd";
import { buildAdvisory } from "@/lib/advisory";

const daily = [
  { date: "2026-06-01", high: 24, low: 18, condition: "Scattered Showers" },
  { date: "2026-06-02", high: 23, low: 3,  condition: "Clear" },
  { date: "2026-06-03", high: 26, low: 15, condition: "Sunny" },
  { date: "2026-06-04", high: 27, low: 16, condition: "Partly Cloudy" },
  { date: "2026-06-05", high: 25, low: 17, condition: "Rain" },
  { date: "2026-06-06", high: 24, low: 16, condition: "Showers" },
  { date: "2026-06-07", high: 26, low: 15, condition: "Sunny" },
];

export const SAMPLE: NormalizedResponse = {
  forecast: {
    location: "Bomet", lat: -0.7833, lon: 35.3417, units: "metric",
    current: { temp: 22.5, humidity: 65, condition: "Partly Cloudy" },
    daily,
    hourly: Array.from({ length: 12 }, (_, i) => ({
      time: `2026-06-01T${String(i * 2).padStart(2, "0")}:00`,
      temp: 18 + (i % 6), condition: i % 3 ? "Cloudy" : "Showers",
    })),
    aiSummary: "Moderate rainfall expected midweek with a cold night on the 2nd. Conditions favour planting later in the week.",
  },
  gdd: computeGdd(daily, 10, "metric"),
  advisory: buildAdvisory(daily),
};
