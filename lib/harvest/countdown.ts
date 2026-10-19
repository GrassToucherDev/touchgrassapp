/**
 * Single source of truth for the Harvest share countdown.
 * Harvest Day is a calendar date (March 1, 2027). Days remaining is a whole
 * calendar-day difference between the user's LOCAL today and that date, so the
 * number only changes once per day at the user's local midnight and the image,
 * caption and on-screen preview can never disagree.
 */
export const HARVEST_DAY = { year: 2027, month: 3, day: 1 } as const; // month is 1-based
export const HARVEST_DAY_LABEL = "MARCH 1, 2027";

const MS_PER_DAY = 86_400_000;

export function daysUntilHarvest(now: Date = new Date()): number {
  const target = Date.UTC(HARVEST_DAY.year, HARVEST_DAY.month - 1, HARVEST_DAY.day);
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.max(0, Math.round((target - today) / MS_PER_DAY));
}

export function isHarvestDay(days: number): boolean {
  return days <= 0;
}

export function countdownHeadline(days: number): string {
  return isHarvestDay(days) ? "HARVEST DAY" : String(days);
}

export function countdownSubline(days: number): string {
  if (isHarvestDay(days)) return HARVEST_DAY_LABEL;
  return `${days === 1 ? "DAY" : "DAYS"} UNTIL HARVEST`;
}

export interface CaptionInput {
  days: number;
  /** Planted $TOUCHGRASS principal, whole tokens. Omit/0 when the user has no position. */
  plantedAmount?: number;
  includeAmount?: boolean;
}

export function buildHarvestCaption({ days, plantedAmount = 0, includeAmount = true }: CaptionInput): string {
  const planted = plantedAmount > 0;
  const opener = planted
    ? includeAmount
      ? `My ${Math.round(plantedAmount).toLocaleString("en-US")} $TOUCHGRASS is planted 🌱`
      : "My $TOUCHGRASS is planted 🌱"
    : "Harvest is growing 🌱";

  const countdown = isHarvestDay(days)
    ? "It's Harvest Day! 🌾"
    : `${days} ${days === 1 ? "day" : "days"} until Harvest.`;

  const status = isHarvestDay(days)
    ? "The wait is over. Planting closed, now we harvest."
    : "Planting is closed. Now we grow toward March 1.";

  return `${opener}\n\n${countdown}\n\n${status}\n\n$TOUCHGRASS #TouchGrass #WAGO`;
}

/** Whole h/m/s until the countdown number next changes (the user's local midnight). */
export function untilNextDay(now: Date = new Date()): { hours: number; minutes: number; seconds: number } {
  const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime();
  const total = Math.max(0, Math.floor((next - now.getTime()) / 1000));
  return { hours: Math.floor(total / 3600), minutes: Math.floor((total % 3600) / 60), seconds: total % 60 };
}
