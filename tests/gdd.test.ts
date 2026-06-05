import { describe, it, expect } from "vitest";
import { computeGdd } from "@/lib/gdd";
import type { DayForecast } from "@/lib/types";

const days: DayForecast[] = [
  { date: "2026-06-01", high: 24, low: 18, condition: "Showers" }, // mean 21, gdd 11
  { date: "2026-06-02", high: 20, low: 12, condition: "Cloudy" },  // mean 16, gdd 6
  { date: "2026-06-03", high: 14, low: 6,  condition: "Cold" },    // mean 10, gdd 0
];

describe("computeGdd", () => {
  it("computes per-day and accumulated GDD with base 10", () => {
    const s = computeGdd(days, 10, "metric");
    expect(s.days.map(d => d.gdd)).toEqual([11, 6, 0]);
    expect(s.days.map(d => d.accumulated)).toEqual([11, 17, 17]);
    expect(s.total).toBe(17);
  });
  it("never returns negative gdd", () => {
    const s = computeGdd([{ date: "x", high: 5, low: 1, condition: "Cold" }], 10, "metric");
    expect(s.days[0].gdd).toBe(0);
  });
  it("handles empty input", () => {
    expect(computeGdd([], 10, "metric").total).toBe(0);
  });
});
