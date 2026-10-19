"use client";

import { useEffect, useState } from "react";
import { pad2 } from "@/lib/harvest/utils";
import { daysUntilHarvest, isHarvestDay, untilNextDay } from "@/lib/harvest/countdown";

type Tick = { days: number; hours: number; minutes: number; seconds: number };

function read(): Tick {
  return { days: daysUntilHarvest(), ...untilNextDay() };
}

const UNITS: Array<{ key: keyof Tick; label: string }> = [
  { key: "days", label: "Days" },
  { key: "hours", label: "Hrs" },
  { key: "minutes", label: "Mins" },
  { key: "seconds", label: "Secs" },
];

/**
 * Days uses the same calendar-day helper as the Share Harvest card and caption,
 * so the dashboard, image and caption always show the same number. The h/m/s
 * boxes count down to the moment that number next changes (local midnight).
 */
export function SeasonCountdown() {
  // Starts null so server and client render the same placeholder markup;
  // the live value is computed after mount to avoid a hydration mismatch.
  const [tick, setTick] = useState<Tick | null>(null);

  useEffect(() => {
    setTick(read());
    const id = setInterval(() => setTick(read()), 1000);
    return () => clearInterval(id);
  }, []);

  if (tick && isHarvestDay(tick.days)) {
    return (
      <p className="font-display text-lg font-bold text-cream" role="status">
        Harvest Day has arrived 🌾
      </p>
    );
  }

  return (
    <div role="timer" aria-label="Days until Harvest">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-cream/70">Days until Harvest</p>
      <div className="flex gap-2 sm:gap-3">
        {UNITS.map(({ key, label }) => (
          <div
            key={key}
            className="flex min-w-[3.25rem] flex-col items-center rounded-xl2 bg-field-light px-2 py-2 sm:px-3 sm:py-3"
          >
            <span className="font-display text-xl sm:text-2xl font-bold tabular-nums text-sun">
              {tick ? (key === "days" ? tick.days : pad2(tick[key])) : "--"}
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wide text-cream/60">{label}</span>
          </div>
        ))}
      </div>
      <p className="mt-2 text-[11px] text-cream/50">Hrs · Mins · Secs count to the next day.</p>
    </div>
  );
}
