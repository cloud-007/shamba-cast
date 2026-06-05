"use client";
import { useState } from "react";
import { REGIONS } from "@/lib/regions";
import { toSms, ussdScreens } from "@/lib/sms";
import type { AdvisoryReport } from "@/lib/types";

export function UssdSimulator({ location, report }: { location: string; report: AdvisoryReport }) {
  const [view, setView] = useState<"root" | "detail">("root");
  const screens = ussdScreens(REGIONS.map(r => r.name), location, report);
  const sms = toSms(location, report);
  return (
    <section>
      <h2 className="mb-1 font-semibold">Last-mile delivery (simulation)</h2>
      <p className="mb-3 text-xs text-gray-500">
        Mirrors Weather-AI's Scale-tier USSD <code>*384#</code> and SMS — no internet needed on the farmer's phone.
      </p>
      <div className="flex flex-wrap gap-6">
        <div className="w-64 rounded-2xl border-4 border-gray-800 bg-gray-900 p-3 text-green-400 font-mono text-xs">
          <pre className="whitespace-pre-wrap min-h-40">{view === "root" ? screens.root : screens.detail}</pre>
          <div className="mt-2 flex gap-2">
            <button className="flex-1 rounded bg-gray-700 px-2 py-1 text-white"
              onClick={() => setView("detail")}>Send</button>
            <button className="flex-1 rounded bg-gray-700 px-2 py-1 text-white"
              onClick={() => setView("root")}>Reset</button>
          </div>
        </div>
        <div className="max-w-xs">
          <p className="mb-1 text-xs text-gray-500">SMS preview ({sms.length}/160)</p>
          <div className="rounded-2xl rounded-bl-none bg-emerald-100 p-3 text-sm">{sms}</div>
        </div>
      </div>
    </section>
  );
}
