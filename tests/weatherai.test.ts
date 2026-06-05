import { describe, it, expect } from "vitest";
import { normalizeWeather } from "@/lib/weatherai";

const RAW = {
  location: { lat: -0.808, lon: 35.35, timezone: "Africa/Nairobi", country: "KE" },
  current: { temperature: 19.7, wind_speed: 18.7, condition_code: "1" },
  daily: [
    { date: "2026-06-05", temp_max: 24.2, temp_min: 13.9, precipitation_sum: 0.6, condition_code: "51" },
    { date: "2026-06-06", temp_max: 23, temp_min: 3, condition_code: "1" },
    { date: "2026-06-07", temp_max: 26, temp_min: 15, condition_code: "63" },
  ],
  hourly: [{ time: "2026-06-05T00:00", temperature: 16.2, condition_code: "2" }],
};

describe("normalizeWeather", () => {
  it("maps nested live fields to the normalized shape", () => {
    const n = normalizeWeather(RAW, "metric", "Bomet");
    expect(n.forecast.location).toBe("Bomet");
    expect(n.forecast.lat).toBe(-0.808);
    expect(n.forecast.current.temp).toBe(19.7);
    expect(n.forecast.current.windKph).toBe(18.7);
    expect(n.forecast.daily[0].high).toBe(24.2);
    expect(n.forecast.daily[0].low).toBe(13.9);
  });
  it("maps WMO condition codes to wet-aware labels", () => {
    const n = normalizeWeather(RAW, "metric", "Bomet");
    expect(n.forecast.daily[0].condition).toMatch(/drizzle/i);
    expect(n.forecast.daily[2].condition).toMatch(/rain/i);
    expect(n.forecast.current.condition).toBe("Mainly clear");
  });
  it("derives location from timezone when no name given", () => {
    const n = normalizeWeather(RAW, "metric");
    expect(n.forecast.location).toBe("Nairobi");
  });
  it("produces a non-empty summary and a frost advisory (low 3 on day 2)", () => {
    const n = normalizeWeather(RAW, "metric", "Bomet");
    expect(n.forecast.summary && n.forecast.summary.length).toBeGreaterThan(0);
    expect(n.forecast.summary).toContain("Bomet");
    expect(n.advisory.items.some((i) => i.kind === "frost")).toBe(true);
  });
});
