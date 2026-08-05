export interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

/** Derives a days/hours/minutes/seconds breakdown from now until `targetIso`. */
export function getCountdown(targetIso: string, now: Date = new Date()): Countdown {
  const target = new Date(targetIso).getTime();
  const diffMs = target - now.getTime();

  if (diffMs <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
  }

  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / 86_400);
  const hours = Math.floor((totalSeconds % 86_400) / 3_600);
  const minutes = Math.floor((totalSeconds % 3_600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds, isPast: false };
}

/** Formats an integer token amount with thousands separators. Never use for floats. */
export function formatTokenAmount(amount: number): string {
  if (!Number.isInteger(amount)) {
    throw new Error("formatTokenAmount requires an integer token amount");
  }
  return amount.toLocaleString("en-US");
}

/** Formats a large count into a compact preview string, e.g. 12543210 -> "12.5M". */
export function formatCompact(amount: number): string {
  return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(
    amount
  );
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

/**
 * Integer-safe clamp used by the Plant widget. Amount and increment are
 * always whole $TOUCHGRASS units — no floating point math on token values.
 */
export function clampToIncrement(amount: number, minimum: number, increment: number): number {
  if (amount < minimum) return minimum;
  const steps = Math.round((amount - minimum) / increment);
  return minimum + steps * increment;
}

export function pad2(n: number): string {
  return n.toString().padStart(2, "0");
}
