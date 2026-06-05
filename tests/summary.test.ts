import { describe, it, expect } from "vitest";
import { buildSummary } from "@/lib/summary";
import type { Forecast } from "@/lib/types";

const base: Forecast = {
  location: "Bomet", lat: 0, lon: 0, units: "metric",
  current: { temp: 20, condition: "Clear sky" },
  daily: [
    { date: "2026-06-05", high: 24, low: 18, condition: "Rain" },
    { date: "2026-06-06", high: 23, low: 3, condition: "Clear sky" },
  ],
  hourly: [],
};

describe("buildSummary", () => {
  it("mentions location and rain when wet days exist", () => {
    const s = buildSummary(base);
    expect(s).toContain("Bomet");
    expect(s).toMatch(/rain expected/i);
  });
  it("flags a cold night when min low <= 4", () => {
    expect(buildSummary(base)).toMatch(/frost|cold night/i);
  });
  it("says mostly dry when no wet days", () => {
    const dry = { ...base, daily: [{ date: "x", high: 25, low: 15, condition: "Clear sky" }] };
    expect(buildSummary(dry)).toMatch(/mostly dry/i);
  });
});
