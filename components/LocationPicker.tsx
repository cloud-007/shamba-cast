"use client";
import { REGIONS, type Region } from "@/lib/regions";
import type { Units } from "@/lib/types";

export function LocationPicker(props: {
  region: Region; units: Units;
  onRegion: (r: Region) => void; onUnits: (u: Units) => void; onGeolocate: () => void;
}) {
  const { region, units, onRegion, onUnits, onGeolocate } = props;
  return (
    <div className="flex flex-wrap items-center gap-3">
      <select className="rounded-lg border px-3 py-2"
        value={region.id}
        onChange={(e) => onRegion(REGIONS.find(r => r.id === e.target.value)!)}>
        {REGIONS.map(r => <option key={r.id} value={r.id}>{r.name} — {r.note}</option>)}
      </select>
      <button onClick={onGeolocate} className="rounded-lg border px-3 py-2">📍 My location</button>
      <div className="ml-auto inline-flex rounded-lg border">
        {(["metric", "imperial"] as Units[]).map(u => (
          <button key={u} onClick={() => onUnits(u)}
            className={`px-3 py-2 ${units === u ? "bg-emerald-600 text-white" : ""}`}>
            {u === "metric" ? "°C" : "°F"}
          </button>
        ))}
      </div>
    </div>
  );
}
