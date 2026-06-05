import type { AdvisoryItem, AdvisoryReport, DayForecast } from "@/lib/types";

const isWet = (c: string) => /rain|shower|storm|drizzle/i.test(c);
const FROST_C = 4;

function longestRun<T>(arr: T[], pred: (x: T) => boolean): { len: number; start: number } {
  let best = { len: 0, start: -1 }, cur = 0, curStart = 0;
  arr.forEach((x, i) => {
    if (pred(x)) { if (cur === 0) curStart = i; cur++; if (cur > best.len) best = { len: cur, start: curStart }; }
    else cur = 0;
  });
  return best;
}

export function buildAdvisory(days: DayForecast[], hasWind = false): AdvisoryReport {
  const items: AdvisoryItem[] = [];
  if (!days.length) return { items };

  // Frost
  const frostDay = days.find(d => d.low <= FROST_C);
  if (frostDay) items.push({ kind: "frost", status: "avoid",
    title: "Frost risk", dayRange: frostDay.date,
    reason: `Overnight low of ${frostDay.low}° on ${frostDay.date} can damage tender crops.` });

  // Heavy rain (>=2 consecutive wet days)
  const wetRun = longestRun(days, d => isWet(d.condition));
  if (wetRun.len >= 2) items.push({ kind: "rain", status: "caution",
    title: "Wet spell ahead", dayRange: `${days[wetRun.start].date}+${wetRun.len}d`,
    reason: `${wetRun.len} consecutive wet days — risk of waterlogging; clear drainage.` });

  // Plant: mild + some rain in outlook
  const mild = (d: DayForecast) => d.low >= 10 && d.high <= 30;
  const plantRun = longestRun(days, d => mild(d));
  const rainSoon = days.some(d => isWet(d.condition));
  items.push(plantRun.len >= 2 && rainSoon
    ? { kind: "plant", status: "good", title: "Good planting window",
        dayRange: `${days[plantRun.start].date}+${plantRun.len}d`,
        reason: `${plantRun.len} mild days with rain in the outlook — soil moisture favourable.` }
    : { kind: "plant", status: "caution", title: "Planting: wait",
        reason: "No run of mild days with expected rain — hold off until conditions improve." });

  // Spray: a dry day; need low wind (unknown on free tier)
  const dryDay = days.find(d => !isWet(d.condition));
  items.push(dryDay
    ? { kind: "spray", status: hasWind ? "good" : "caution", title: "Spray window",
        dayRange: dryDay.date,
        reason: hasWind ? `Dry and calm on ${dryDay.date}.`
          : `Dry on ${dryDay.date}. Wind data isn't on the free tier — confirm low wind before spraying.` }
    : { kind: "spray", status: "avoid", title: "No spray window",
        reason: "Wet across the outlook — spraying would wash off." });

  // Harvest: consecutive dry days
  const dryRun = longestRun(days, d => !isWet(d.condition));
  items.push(dryRun.len >= 2
    ? { kind: "harvest", status: "good", title: "Harvest window",
        dayRange: `${days[dryRun.start].date}+${dryRun.len}d`,
        reason: `${dryRun.len} consecutive dry days — good for harvesting and drying.` }
    : { kind: "harvest", status: "caution", title: "Harvest: limited",
        reason: "Few dry days in a row — plan around scattered rain." });

  return { items };
}
