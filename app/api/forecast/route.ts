import { NextRequest, NextResponse } from "next/server";
import { fetchForecast, WeatherAiError } from "@/lib/weatherai";
import type { Units } from "@/lib/types";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const rawLat = sp.get("lat"), rawLon = sp.get("lon");
  if (rawLat === null || rawLon === null || !Number.isFinite(Number(rawLat)) || !Number.isFinite(Number(rawLon))) {
    return NextResponse.json({ error: "lat and lon are required numbers" }, { status: 400 });
  }
  const lat = Number(rawLat), lon = Number(rawLon);
  const units: Units = sp.get("units") === "imperial" ? "imperial" : "metric";
  const key = process.env.WEATHER_AI_API_KEY;
  if (!key) return NextResponse.json({ error: "Server is missing its API key." }, { status: 500 });

  try {
    const data = await fetchForecast(lat, lon, units, key);
    return NextResponse.json(data);
  } catch (e) {
    if (e instanceof WeatherAiError) {
      const status = e.status === 401 || e.status === 403 ? 502 : e.status;
      return NextResponse.json({ error: e.publicMessage }, { status });
    }
    return NextResponse.json({ error: "Unexpected error." }, { status: 500 });
  }
}
