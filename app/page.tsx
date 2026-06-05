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
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [coords, setCoords] = useState({
    lat: region.lat,
    lon: region.lon,
    name: region.name,
  });

  // Depends on the whole coords object (and units) so the location name passed
  // to the API is never stale — fixes "My location" showing the previous place.
  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await fetch(
        `/api/forecast?lat=${coords.lat}&lon=${coords.lon}&units=${units}&name=${encodeURIComponent(
          coords.name
        )}`
      );
      const j = await r.json();
      if (!r.ok) throw new Error(j.error ?? "Could not load the forecast.");
      setData(j);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load the forecast.");
      setData(SAMPLE); // demo fallback so the page is never blank
    } finally {
      setLoading(false);
    }
  }, [coords, units]);

  useEffect(() => {
    load();
  }, [load]);

  const onRegion = (r: Region) => {
    setRegion(r);
    setCoords({ lat: r.lat, lon: r.lon, name: r.name });
  };

  const onGeolocate = () => {
    if (!navigator.geolocation) {
      setError("Your device can’t share its location.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (p) => {
        setCoords({ lat: p.coords.latitude, lon: p.coords.longitude, name: "My farm" });
        setLocating(false);
      },
      () => {
        setError("Couldn’t get your location — pick a region instead.");
        setLocating(false);
      },
      { timeout: 10000 }
    );
  };

  return (
    <div className="relative z-10 flex min-h-full flex-col">
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:py-12">
        <header className="reveal mb-8 flex items-center gap-4">
          <BrandMark />
          <div>
            <h1 className="font-display text-3xl font-semibold leading-none text-ink sm:text-4xl">
              Shamba Cast
            </h1>
            <p className="mt-1.5 font-body text-sm text-ink-soft">
              Habari! Here’s the weather for your farm — and what to do about it.
            </p>
          </div>
        </header>

        <div className="reveal mb-6" style={{ animationDelay: "60ms" }}>
          <LocationPicker
            region={region}
            units={units}
            locating={locating}
            onRegion={onRegion}
            onUnits={setUnits}
            onGeolocate={onGeolocate}
          />
        </div>

        {error && (
          <p className="reveal mb-6 rounded-2xl border border-maize/40 bg-maize/10 px-4 py-3 font-body text-sm text-ink">
            {error} Showing example data so you can still look around.
          </p>
        )}
        {loading && !data && (
          <p className="font-body text-ink-soft">Loading your farm’s weather…</p>
        )}

        {data && (
          <div className="space-y-9">
            <div
              className="reveal grid gap-5 lg:grid-cols-3"
              style={{ animationDelay: "120ms" }}
            >
              <div className="lg:col-span-2">
                <CurrentCard forecast={data.forecast} />
              </div>
              <AiSummaryPanel summary={data.forecast.summary} />
            </div>

            <div className="reveal" style={{ animationDelay: "180ms" }}>
              <AdvisoryPanel report={data.advisory} />
            </div>

            <div className="reveal" style={{ animationDelay: "240ms" }}>
              <ForecastStrip days={data.forecast.daily} units={units} />
            </div>

            <div className="reveal" style={{ animationDelay: "300ms" }}>
              <GddCard gdd={data.gdd} />
            </div>

            <div className="reveal" style={{ animationDelay: "360ms" }}>
              <HourlyStrip hours={data.forecast.hourly} units={units} />
            </div>

            <div className="reveal" style={{ animationDelay: "420ms" }}>
              <UssdSimulator location={coords.name} report={data.advisory} />
            </div>
          </div>
        )}
      </main>

      <footer className="relative z-10 mt-12 bg-soil px-4 py-6 text-center font-body text-xs leading-relaxed text-paper/60">
        <p className="mx-auto max-w-3xl">
          Advice and the briefing are worked out on the spot from Weather-AI’s free forecast (their
          AI insights are a paid feature). The phone preview shows how Weather-AI delivers alerts by
          SMS &amp; USSD. Built with the Weather-AI API.
        </p>
      </footer>
    </div>
  );
}

function BrandMark() {
  return (
    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-maize to-maize-deep shadow-md">
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle cx="12" cy="12" r="5" fill="#fff" />
        <g stroke="#fff" strokeWidth="2" strokeLinecap="round">
          <path d="M12 1v3M12 20v3M1 12h3M20 12h3M4 4l1.8 1.8M18.2 18.2l1.8 1.8M20 4l-1.8 1.8M5.8 18.2L4 20" />
        </g>
      </svg>
    </span>
  );
}
