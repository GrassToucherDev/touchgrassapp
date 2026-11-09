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
  /** Bump to rotate to the next caption. Combined with the day number so each day starts differently. */
  variant?: number;
}

// {mine_} = same, lowercase "my" for mid-sentence; {mine} = "My 50,000 $TOUCHGRASS" / "My $TOUCHGRASS"; {n} = "113 days"
const PLANTED_LINES = [
  "{mine} is in the ground. I check on it every five minutes. It has not grown. {n} to go. 🌱",
  "Planted my seeds and now I'm just standing over the dirt staring at it. {n} until Harvest. 👀",
  "{mine} is planted. Patience is a virtue and I am a tourist. {n} until Harvest. 🧑‍🌾",
  "Told {mine_} to grow. It said \"wait {n}.\" Rude. 🌱",
  "Real farmers wake up at 5am. I refresh the countdown every hour. {n} until Harvest. 🌾",
  "Is it Harvest yet? No. Is it Harvest yet? Still no. {n} to go. {mine} is on it. 🌱",
  "{mine} is planted and WAGO is doing victory laps. Sir, it is not time yet. {n} to go. ☀️",
];

const VISITOR_LINES = [
  "Watching everyone else's seeds grow like it's a sport. {n} until Harvest. 🍿",
  "Harvest is {n} away and WAGO is already doing a victory dance. Sir, it's not time yet. ☀️",
  "Growing season is going great. By great I mean I've refreshed this page 40 times. {n} until Harvest. 🌱",
  "Plot twist: the grass was the real friend we touched along the way. {n} until Harvest. 🌾",
  "Doctors say touch grass. Harvest says wait {n}. I'm doing both. 🌱",
  "Nothing to see here, just a very patient sun. {n} until Harvest. ☀️",
];

const HARVEST_DAY_LINES = [
  "HARVEST DAY. I have never been so ready to dig something up. 🌾",
  "The wait is over. Put down the watering can. It's Harvest Day! 🧑‍🌾",
  "Planted. Waited. Refreshed 4,000 times. It's Harvest Day! ☀️",
];

export function buildHarvestCaption({ days, plantedAmount = 0, includeAmount = true, variant = 0 }: CaptionInput): string {
  const planted = plantedAmount > 0;
  const mine =
    planted && includeAmount ? `My ${Math.round(plantedAmount).toLocaleString("en-US")} $TOUCHGRASS` : "My $TOUCHGRASS";
  const mineLc = mine.replace(/^My/, "my");
  const n = `${days} ${days === 1 ? "day" : "days"}`;

  const pool = isHarvestDay(days) ? HARVEST_DAY_LINES : planted ? PLANTED_LINES : VISITOR_LINES;
  const idx = (((Math.abs(days) + variant) % pool.length) + pool.length) % pool.length;
  const line = pool[idx].replace("{mine_}", mineLc).replace("{mine}", mine).replace("{n}", n);

  return `${line}\n\n$TOUCHGRASS #TouchGrass #WAGO`;
}

/** Whole h/m/s until the countdown number next changes (the user's local midnight). */
export function untilNextDay(now: Date = new Date()): { hours: number; minutes: number; seconds: number } {
  const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime();
  const total = Math.max(0, Math.floor((next - now.getTime()) / 1000));
  return { hours: Math.floor(total / 3600), minutes: Math.floor((total % 3600) / 60), seconds: total % 60 };
}
