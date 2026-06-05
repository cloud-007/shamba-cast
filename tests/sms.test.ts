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
