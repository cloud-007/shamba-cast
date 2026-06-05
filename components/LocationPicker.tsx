"use client";
import { REGIONS, type Region } from "@/lib/regions";
import type { Units } from "@/lib/types";

export function LocationPicker(props: {
  region: Region;
  units: Units;
  locating: boolean;
  onRegion: (r: Region) => void;
  onUnits: (u: Units) => void;
  onGeolocate: () => void;
}) {
  const { region, units, locating, onRegion, onUnits, onGeolocate } = props;
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-paper/70 p-3 shadow-sm">
      <label className="flex items-center gap-2 font-body text-sm text-ink-soft">
        <span aria-hidden>📍</span>
        <span className="sr-only">Choose your area</span>
        <select
          className="field-select rounded-xl border border-line bg-paper px-4 py-2 pr-9 font-body text-sm font-medium text-ink focus:outline-none focus:ring-2 focus:ring-leaf/40"
          value={region.id}
          onChange={(e) => onRegion(REGIONS.find((r) => r.id === e.target.value)!)}
        >
          {REGIONS.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name} — {r.note}
            </option>
          ))}
        </select>
      </label>

      <button
        onClick={onGeolocate}
        disabled={locating}
        className="rounded-xl border border-leaf/40 bg-leaf/10 px-4 py-2 font-body text-sm font-medium text-leaf-deep transition hover:bg-leaf/20 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {locating ? "Finding you…" : "Use my farm’s location"}
      </button>

      <div className="ml-auto inline-flex overflow-hidden rounded-xl border border-line">
        {(["metric", "imperial"] as Units[]).map((u) => (
          <button
            key={u}
            onClick={() => onUnits(u)}
            className={`px-4 py-2 font-body text-sm font-medium transition ${
              units === u ? "bg-ink text-paper" : "bg-paper text-ink-soft hover:bg-paper-2"
            }`}
          >
            {u === "metric" ? "°C" : "°F"}
          </button>
        ))}
      </div>
    </div>
  );
}
