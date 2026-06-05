import type { Forecast } from "@/lib/types";

// A short, locally-generated forecast briefing built from the free-tier data.
// This is NOT Weather-AI's paid AI summary (their /v1/insights endpoint requires a Pro plan).
export function buildSummary(f: Forecast): string {
  const u = f.units === "metric" ? "°C" : "°F";
  if (!f.daily.length) {
    return `Currently ${Math.round(f.current.temp)}${u} and ${f.current.condition.toLowerCase()} in ${f.location}.`;
  }
  const highs = f.daily.map((d) => d.high);
  const lows = f.daily.map((d) => d.low);
  const avgHigh = Math.round(highs.reduce((a, b) => a + b, 0) / highs.length);
  const minLow = Math.round(Math.min(...lows));
  const wet = f.daily.filter((d) => /rain|shower|storm|drizzle/i.test(d.condition));
  const rainPhrase = wet.length
    ? ` ${wet.length} day${wet.length > 1 ? "s" : ""} of rain expected, starting ${wet[0].date}.`
    : " Mostly dry through the week.";
  const coldPhrase = minLow <= 4 ? ` A cold night near ${minLow}${u} — watch for frost.` : "";
  return (
    `Currently ${Math.round(f.current.temp)}${u} and ${f.current.condition.toLowerCase()} in ${f.location}. ` +
    `Over the next ${f.daily.length} days, highs around ${avgHigh}${u} and lows near ${minLow}${u}.` +
    rainPhrase + coldPhrase
  );
}
