"use client";
import { useState } from "react";
import { REGIONS } from "@/lib/regions";
import { toSms, ussdScreens } from "@/lib/sms";
import type { AdvisoryReport } from "@/lib/types";
import { SectionTitle } from "@/components/SectionTitle";

export function UssdSimulator({
  location,
  report,
}: {
  location: string;
  report: AdvisoryReport;
}) {
  const [view, setView] = useState<"root" | "detail">("root");
  const screens = ussdScreens(
    REGIONS.map((r) => r.name),
    location,
    report
  );
  const sms = toSms(location, report);

  return (
    <section>
      <SectionTitle kicker="No internet?" title="Get it on any phone" />
      <p className="-mt-2 mb-5 max-w-2xl font-body text-sm leading-relaxed text-ink-soft">
        Not every farmer has a smartphone or data. The same advice reaches{" "}
        <span className="font-semibold text-ink">any phone</span> by text message, or by dialling{" "}
        <span className="font-semibold text-ink">*384#</span> — no internet needed. Here’s a preview
        of how Weather-AI delivers it.
      </p>

      <div className="flex flex-wrap items-start gap-8">
        {/* feature phone */}
        <div className="w-[230px] rounded-[2rem] border-[6px] border-soil bg-soil p-3 shadow-[0_22px_50px_-22px_rgba(34,26,16,0.75)]">
          <div className="min-h-[176px] rounded-lg bg-[#16200f] p-3 font-mono text-[11px] leading-relaxed text-[#9be36d]">
            <pre className="whitespace-pre-wrap">
              {view === "root" ? screens.root : screens.detail}
            </pre>
          </div>
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => setView("detail")}
              className="flex-1 rounded-lg bg-leaf px-2 py-2 font-body text-xs font-semibold text-paper transition hover:bg-leaf-deep"
            >
              Send
            </button>
            <button
              onClick={() => setView("root")}
              className="flex-1 rounded-lg bg-paper/15 px-2 py-2 font-body text-xs font-semibold text-paper transition hover:bg-paper/25"
            >
              Reset
            </button>
          </div>
          <p className="mt-2 text-center font-body text-[10px] text-paper/50">
            feature phone · USSD
          </p>
        </div>

        {/* SMS bubble */}
        <div className="max-w-xs">
          <p className="mb-2 font-body text-xs uppercase tracking-wide text-ink-soft">
            Text message · {sms.length}/160 characters
          </p>
          <div className="rounded-2xl rounded-bl-md border border-leaf/30 bg-leaf/10 p-4 font-body text-sm leading-relaxed text-ink shadow-sm">
            {sms}
          </div>
          <p className="mt-2 font-body text-xs text-ink-soft">
            Short enough for a single SMS, on any handset.
          </p>
        </div>
      </div>
    </section>
  );
}
