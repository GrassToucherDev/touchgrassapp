import { describe, expect, it } from "vitest";
import { getCountdown, clampToIncrement, formatTokenAmount } from "@/lib/harvest/utils";

describe("getCountdown", () => {
  it("derives days/hours/minutes/seconds from a configured ISO date, not hardcoded values", () => {
    const now = new Date("2026-08-01T00:00:00Z");
    const target = "2026-08-03T06:30:15Z";
    const result = getCountdown(target, now);

    expect(result.isPast).toBe(false);
    expect(result.days).toBe(2);
    expect(result.hours).toBe(6);
    expect(result.minutes).toBe(30);
    expect(result.seconds).toBe(15);
  });

  it("reports isPast for a date already reached", () => {
    const now = new Date("2026-08-10T13:00:00Z");
    expect(getCountdown("2026-08-10T12:00:00Z", now).isPast).toBe(true);
  });
});

describe("clampToIncrement / integer-safe amounts", () => {
  it("never goes below the minimum", () => {
    expect(clampToIncrement(0, 50_000, 50_000)).toBe(50_000);
  });

  it("snaps to the nearest increment above minimum", () => {
    expect(clampToIncrement(120_000, 50_000, 50_000)).toBe(100_000);
  });
});

describe("formatTokenAmount", () => {
  it("throws on non-integer amounts, guarding against float token math", () => {
    expect(() => formatTokenAmount(50_000.5)).toThrow();
  });

  it("formats integers with thousands separators", () => {
    expect(formatTokenAmount(1_000_000)).toBe("1,000,000");
  });
});
