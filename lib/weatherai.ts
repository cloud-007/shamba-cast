import { z } from "zod";
import type { NormalizedResponse, Units } from "@/lib/types";
import { computeGdd } from "@/lib/gdd";
import { buildAdvisory } from "@/lib/advisory";

const BASE = "https://api.weather-ai.co";

// Defensive: docs sample was truncated, so most fields are optional.
const DaySchema = z.object({
  date: z.string(),
  high: z.number(), low: z.number(),
  condition: z.string().default("Unknown"),
  precip_mm: z.number().optional(),
});
const WeatherSchema = z.object({
  location: z.string().default("Unknown"),
  lat: z.number(), lon: z.number(),
  current: z.object({
    temp: z.number(),
    humidity: z.number().optional(),
    condition: z.string().default("Unknown"),
    wind_kph: z.number().optional(),
    precip_mm: z.number().optional(),
  }),
  forecast: z.array(DaySchema).default([]),
  hourly: z.array(z.object({
    time: z.string(), temp: z.number(), condition: z.string().default("Unknown"),
  })).optional(),
  ai_summary: z.string().optional(),
});

export class WeatherAiError extends Error {
  constructor(public status: number, public publicMessage: string) { super(publicMessage); }
}

export async function fetchForecast(
  lat: number, lon: number, units: Units, key: string
): Promise<NormalizedResponse> {
  const url = `${BASE}/v1/weather?lat=${lat}&lon=${lon}&days=7&ai=true&units=${units}`;
  let res: Response;
  try {
    res = await fetch(url, { headers: { Authorization: `Bearer ${key}` }, cache: "no-store" });
  } catch {
    throw new WeatherAiError(503, "Weather service is unreachable. Try again shortly.");
  }
  if (!res.ok) {
    const map: Record<number, string> = {
      401: "API key rejected.", 403: "This endpoint isn't on the free plan.",
      429: "Rate limited — try again in a minute.",
    };
    throw new WeatherAiError(res.status, map[res.status] ?? "Weather service error.");
  }
  const parsed = WeatherSchema.parse(await res.json());

  const daily = parsed.forecast.map(d => ({
    date: d.date, high: d.high, low: d.low, condition: d.condition, precipMm: d.precip_mm,
  }));
  const hasWind = parsed.current.wind_kph !== undefined;

  return {
    forecast: {
      location: parsed.location, lat: parsed.lat, lon: parsed.lon, units,
      current: {
        temp: parsed.current.temp, humidity: parsed.current.humidity,
        condition: parsed.current.condition, windKph: parsed.current.wind_kph,
        precipMm: parsed.current.precip_mm,
      },
      daily,
      hourly: (parsed.hourly ?? []).map(h => ({ time: h.time, temp: h.temp, condition: h.condition })),
      aiSummary: parsed.ai_summary,
    },
    gdd: computeGdd(daily, 10, units),
    advisory: buildAdvisory(daily, hasWind),
  };
}
