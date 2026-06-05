"use client";
import { useEffect, useState, useCallback } from "react";
import { DEFAULT_REGION, type Region } from "@/lib/regions";
import type { NormalizedResponse, Units } from "@/lib/types";
import { SAMPLE } from "@/lib/fixtures/sample";
import { LocationPicker } from "@/components/LocationPicker";
import { CurrentCard } from "@/components/CurrentCard";
import { ForecastStrip } from "@/components/ForecastStrip";
import { HourlyStrip } from "@/components/HourlyStrip";
import { AiSummaryPanel } from "@/components/AiSummaryPanel";
import { AdvisoryPanel } from "@/components/AdvisoryPanel";
import { GddCard } from "@/components/GddCard";
import { UssdSimulator } from "@/components/UssdSimulator";

export default function Page() {
  const [region, setRegion] = useState<Region>(DEFAULT_REGION);
  const [units, setUnits] = useState<Units>("metric");
  const [data, setData] = useState<NormalizedResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [coords, setCoords] = useState({ lat: region.lat, lon: region.lon, name: region.name });

  const load = useCallback(async (lat: number, lon: number) => {
    setLoading(true); setError(null);
    try {
      const r = await fetch(`/api/forecast?lat=${lat}&lon=${lon}&units=${units}`);
      const j = await r.json();
      if (!r.ok) throw new Error(j.error ?? "Failed");
      setData(j);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
      setData(SAMPLE); // demo fallback so the live link is never blank
    } finally { setLoading(false); }
  }, [units]);

  useEffect(() => { load(coords.lat, coords.lon); }, [coords, load]);

  const onRegion = (r: Region) => { setRegion(r); setCoords({ lat: r.lat, lon: r.lon, name: r.name }); };
  const onGeolocate = () => navigator.geolocation?.getCurrentPosition(
    (p) => setCoords({ lat: p.coords.latitude, lon: p.coords.longitude, name: "My location" }),
    () => setError("Location permission denied."));

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-emerald-700">Shamba Cast</h1>
        <p className="text-gray-600">Weather advisories for farmers — powered by Weather-AI.</p>
      </header>
      <LocationPicker region={region} units={units}
        onRegion={onRegion} onUnits={setUnits} onGeolocate={onGeolocate} />
      {error && <p className="rounded-lg bg-amber-50 px-4 py-2 text-amber-800">
        {error} — showing sample data.</p>}
      {loading && <p className="text-gray-500">Loading…</p>}
      {data && <>
        <div className="grid gap-6 md:grid-cols-3">
          <CurrentCard forecast={data.forecast} />
          <AiSummaryPanel summary={data.forecast.aiSummary} />
          <GddCard gdd={data.gdd} />
        </div>
        <ForecastStrip days={data.forecast.daily} units={units} />
        <HourlyStrip hours={data.forecast.hourly} units={units} />
        <AdvisoryPanel report={data.advisory} />
        <UssdSimulator location={coords.name} report={data.advisory} />
      </>}
      <footer className="pt-8 text-xs text-gray-400">
        Advisories are derived from free-tier forecast data, not Weather-AI's paid /v1/insights.
        SMS/USSD below is a simulation of Weather-AI's Scale-tier last-mile delivery.
      </footer>
    </main>
  );
}
