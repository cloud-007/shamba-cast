import type { AdvisoryReport } from "@/lib/types";

const ICON: Record<string, string> = { avoid: "!", caution: "~", good: "+", info: "i" };

export function toSms(location: string, report: AdvisoryReport): string {
  const head = `WeatherAI ${location}: `;
  const parts = report.items
    .filter(i => i.status === "avoid" || i.status === "good")
    .map(i => `${ICON[i.status]}${i.title}`);
  let body = parts.join("; ") || "No major alerts. Conditions stable.";
  let msg = head + body;
  if (msg.length > 160) msg = msg.slice(0, 157) + "...";
  return msg;
}

export interface UssdScreens { root: string; detail: string; }

export function ussdScreens(regions: string[], selected: string, report: AdvisoryReport): UssdScreens {
  const root = [`CON WeatherAI *384#`, `Select region:`,
    ...regions.map((r, i) => `${i + 1}. ${r}`)].join("\n");
  const lines = report.items.map(i => `${ICON[i.status]} ${i.title}`);
  const detail = [`END ${selected} advisory:`, ...lines,
    ``, `Reply HELP for agronomist.`].join("\n");
  return { root, detail };
}
