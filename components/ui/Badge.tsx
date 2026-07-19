import { ReactNode } from "react";

type Tone = "grass" | "sun" | "harvest" | "neutral";

const toneClasses: Record<Tone, string> = {
  grass: "bg-grass/15 text-grass-dark",
  sun: "bg-sun/20 text-harvest-dark",
  harvest: "bg-harvest/15 text-harvest-dark",
  neutral: "bg-ink/5 text-ink-soft",
};

export function Badge({ tone = "neutral", children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${toneClasses[tone]}`}
    >
      {children}
    </span>
  );
}
