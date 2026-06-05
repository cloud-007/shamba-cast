import { z } from "zod";
import type { Forecast, NormalizedResponse, Units } from "@/lib/types";
import { computeGdd } from "@/lib/gdd";
import { buildAdvisory } from "@/lib/advisory";
import { buildSummary } from "@/lib/summary";
import { wmoLabel } from "@/lib/wmo";

const BASE = "https://api.weather-ai.co";

const RawSchema = z.object({
  location: z.object({
    lat: z.number(),
    lon: z.number(),
    timezone: z.string().optional(),
    country: z.string().optional(),
  }),
  current: z.object({
    temperature: z.number(),
    wind_speed: z.number().optional(),
    condition_code: z.union([z.string(), z.number()]).optional(),
    humidity: z.number().optional(),
  }),
  daily: z
    .array(
      z.object({
        date: z.string(),
        temp_max: z.number(),
        temp_min: z.number(),
        precipitation_sum: z.number().optional(),
        condition_code: z.union([z.string(), z.number()]).optional(),
      })
    )
    .default([]),
  hourly: z
    .array(
      z.object({
        time: z.string(),
        temperature: z.number(),
        condition_code: z.union([z.string(), z.number()]).optional(),
      })
    )
    .default([]),
});

export class WeatherAiError extends Error {
  constructor(public status: number, public publicMessage: string) {
    super(publicMessage);
  }
}

function displayName(name: string | undefined, tz?: string, country?: string): string {
  if (name && name.trim()) return name;
  if (tz && tz.includes("/")) return tz.split("/").pop()!.replace(/_/g, " ");
  return country ?? "Unknown";
}

export function normalizeWeather(raw: unknown, units: Units, name?: string): NormalizedResponse {
  const p = RawSchema.parse(raw);
  const daily = p.daily.slice(0, 7).map((d) => ({
    date: d.date,
    high: d.temp_max,
    low: d.temp_min,
    condition: wmoLabel(d.condition_code),
    precipMm: d.precipitation_sum,
  }));
  const lowWind = (p.current.wind_speed ?? Infinity) < 20;
  const forecast: Forecast = {
    location: displayName(name, p.location.timezone, p.location.country),
    lat: p.location.lat,
    lon: p.location.lon,
    units,
    current: {
      temp: p.current.temperature,
      humidity: p.current.humidity,
      condition: wmoLabel(p.current.condition_code),
      windKph: p.current.wind_speed,
    },
    daily,
    hourly: p.hourly.slice(0, 24).map((h) => ({
      time: h.time,
      temp: h.temperature,
      condition: wmoLabel(h.condition_code),
    })),
  };
  forecast.summary = buildSummary(forecast);
  return {
    forecast,
    gdd: computeGdd(daily, 10, units),
    advisory: buildAdvisory(daily, lowWind),
  };
}

export async function fetchForecast(
  lat: number,
  lon: number,
  units: Units,
  key: string,
  name?: string
): Promise<NormalizedResponse> {
  const url = `${BASE}/v1/weather?lat=${lat}&lon=${lon}&days=7&units=${units}`;
  let res: Response;
  try {
    res = await fetch(url, { headers: { Authorization: `Bearer ${key}` }, cache: "no-store" });
  } catch {
    throw new WeatherAiError(503, "Weather service is unreachable. Try again shortly.");
  }
  if (!res.ok) {
    const map: Record<number, string> = {
      401: "API key rejected.",
      403: "This endpoint isn't on the free plan.",
      429: "Rate limited — try again in a minute.",
    };
    throw new WeatherAiError(res.status, map[res.status] ?? "Weather service error.");
  }
  return normalizeWeather(await res.json(), units, name);
}
