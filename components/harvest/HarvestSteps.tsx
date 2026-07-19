import { Card } from "@/components/ui/Card";

const STEPS = [
  { icon: "🌱", title: "Plant", body: "Deposit $TOUCHGRASS during the planting window." },
  { icon: "🌾", title: "Grow", body: "Your tokens remain locked until Harvest Day." },
  {
    icon: "🧺",
    title: "Harvest",
    body: "Reclaim your full principal. Seasonal rewards are distributed separately.",
  },
];

export function HarvestSteps() {
  return (
    <section aria-labelledby="how-it-works-heading">
      <Card>
        <h2 id="how-it-works-heading" className="font-display text-lg font-bold text-ink">
          How Harvest works
        </h2>
        <ol className="mt-4 grid gap-4 sm:grid-cols-3">
          {STEPS.map((step) => (
            <li key={step.title} className="flex flex-col gap-1 rounded-xl2 bg-cream p-4">
              <span className="text-2xl" aria-hidden="true">
                {step.icon}
              </span>
              <span className="font-display font-bold text-ink">{step.title}</span>
              <span className="text-sm text-ink-soft">{step.body}</span>
            </li>
          ))}
        </ol>
        <p className="mt-4 text-xs font-medium text-ink-soft">
          Harvest is not automatic yield or traditional staking — principal and rewards are
          tracked and returned separately.
        </p>
      </Card>
    </section>
  );
}
