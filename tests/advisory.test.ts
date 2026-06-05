import { describe, it, expect } from "vitest";
import { buildAdvisory } from "@/lib/advisory";
import type { DayForecast } from "@/lib/types";

const rainy: DayForecast[] = [
  { date: "1", high: 24, low: 18, condition: "Scattered Showers" },
  { date: "2", high: 23, low: 17, condition: "Rain" },
  { date: "3", high: 25, low: 19, condition: "Showers" },
];
const frosty: DayForecast[] = [
  { date: "1", high: 14, low: 3, condition: "Clear" },
  { date: "2", high: 16, low: 8, condition: "Sunny" },
];
const dry: DayForecast[] = [
  { date: "1", high: 26, low: 15, condition: "Sunny" },
  { date: "2", high: 27, low: 16, condition: "Clear" },
  { date: "3", high: 28, low: 17, condition: "Partly Cloudy" },
];

describe("buildAdvisory", () => {
  it("flags a heavy-rain alert for >=2 consecutive rain days", () => {
    const r = buildAdvisory(rainy);
    expect(r.items.some(i => i.kind === "rain")).toBe(true);
  });
  it("flags frost when a low is <= 4", () => {
    const r = buildAdvisory(frosty);
    const frost = r.items.find(i => i.kind === "frost");
    expect(frost?.status).toBe("avoid");
  });
  it("recommends a harvest window over consecutive dry days", () => {
    const r = buildAdvisory(dry);
    expect(r.items.some(i => i.kind === "harvest" && i.status === "good")).toBe(true);
  });
  it("always returns plant/spray/harvest items", () => {
    const kinds = buildAdvisory(dry).items.map(i => i.kind);
    expect(kinds).toEqual(expect.arrayContaining(["plant", "spray", "harvest"]));
  });
});
