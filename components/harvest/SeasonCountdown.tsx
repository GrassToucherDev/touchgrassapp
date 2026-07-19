"use client";

import { useEffect, useState } from "react";
import { getCountdown, pad2 } from "@/lib/harvest/utils";

const UNITS: Array<{ key: "days" | "hours" | "minutes" | "seconds"; label: string }> = [
  { key: "days", label: "Days" },
  { key: "hours", label: "Hrs" },
  { key: "minutes", label: "Mins" },
  { key: "seconds", label: "Secs" },
];

export function SeasonCountdown({ targetIso }: { targetIso: string }) {
  // Starts null so server and client render the same placeholder markup;
  // the live value is computed after mount to avoid a hydration mismatch
  // from server time vs. client time (no Date.now()/Math.random() in render).
  const [countdown, setCountdown] = useState<ReturnType<typeof getCountdown> | null>(null);

  useEffect(() => {
    setCountdown(getCountdown(targetIso));
    const id = setInterval(() => setCountdown(getCountdown(targetIso)), 1000);
    return () => clearInterval(id);
  }, [targetIso]);

  if (!countdown) {
    return (
      <div role="timer" aria-label="Countdown to Harvest Day">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-cream/70">
          Harvest Day in
        </p>
        <div className="flex gap-2 sm:gap-3">
          {UNITS.map(({ key, label }) => (
            <div
              key={key}
              className="flex min-w-[3.25rem] flex-col items-center rounded-xl2 bg-field-light px-2 py-2 sm:px-3 sm:py-3"
            >
              <span className="font-display text-xl sm:text-2xl font-bold tabular-nums text-sun">
                --
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wide text-cream/60">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (countdown.isPast) {
    return (
      <p className="font-display text-lg font-bold text-cream" role="status">
        Harvest Day has arrived 🌾
      </p>
    );
  }

  return (
    <div role="timer" aria-label="Countdown to Harvest Day">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-cream/70">
        Harvest Day in
      </p>
      <div className="flex gap-2 sm:gap-3">
        {UNITS.map(({ key, label }) => (
          <div
            key={key}
            className="flex min-w-[3.25rem] flex-col items-center rounded-xl2 bg-field-light px-2 py-2 sm:px-3 sm:py-3"
          >
            <span className="font-display text-xl sm:text-2xl font-bold tabular-nums text-sun">
              {pad2(countdown[key])}
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wide text-cream/60">
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
