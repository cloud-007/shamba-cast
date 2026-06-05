import { describe, it, expect } from "vitest";
import { toSms, ussdScreens } from "@/lib/sms";
import type { AdvisoryReport } from "@/lib/types";

const report: AdvisoryReport = { items: [
  { kind: "frost", status: "avoid", title: "Frost risk", reason: "Low 3° on 2026-06-02." },
  { kind: "plant", status: "good", title: "Good planting window", reason: "Mild + rain." },
] };

describe("toSms", () => {
  it("produces a <=160 char message", () => {
    expect(toSms("Bomet", report).length).toBeLessThanOrEqual(160);
  });
  it("includes the location", () => {
    expect(toSms("Bomet", report)).toMatch(/Bomet/);
  });
});

describe("ussdScreens", () => {
  it("returns a root menu listing regions", () => {
    const s = ussdScreens(["Bomet", "Nakuru"], "Bomet", report);
    expect(s.root).toMatch(/\*384#/);
    expect(s.root).toMatch(/1\. Bomet/);
  });
});

describe("toSms edge cases", () => {
  it("empty report items produces 'No major alerts' message", () => {
    const msg = toSms("Bomet", { items: [] });
    expect(msg).toContain("No major alerts");
  });
  it("very long location (200 chars) still produces <=160 char message", () => {
    const longLoc = "A".repeat(200);
    expect(toSms(longLoc, report).length).toBeLessThanOrEqual(160);
  });
});
