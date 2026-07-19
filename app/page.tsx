import Link from "next/link";
import { PageHeader } from "@/components/shell/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

const FEATURES = [
  {
    href: "/harvest",
    icon: "🌾",
    title: "Harvest",
    body: "Plant $TOUCHGRASS and grow together toward Harvest Day.",
    live: true,
  },
  {
    href: "/proof-of-grass",
    icon: "🌿",
    title: "Proof of Grass",
    body: "Log real outdoor time and turn it into on-chain proof.",
    live: false,
  },
  {
    href: "/leaderboard",
    icon: "🏆",
    title: "Leaderboard",
    body: "See how your season stacks up against the community.",
    live: false,
  },
  {
    href: "/quests",
    icon: "🧭",
    title: "Quests",
    body: "Complete challenges to earn seasonal rewards.",
    live: false,
  },
  {
    href: "/premium",
    icon: "⭐",
    title: "Premium+",
    body: "Unlock enhanced themes and ecosystem perks.",
    live: false,
  },
  {
    href: "/profile",
    icon: "👤",
    title: "Profile",
    body: "Your wallet, stats, and Touch Grass history.",
    live: false,
  },
];

export default function DashboardPage() {
  return (
    <div className="pb-10">
      <PageHeader title="Dashboard" subtitle="Your Touch Grass ecosystem, in one place." />

      <div className="mt-6 grid grid-cols-1 gap-4 px-4 sm:grid-cols-2 sm:px-8 lg:grid-cols-3">
        {FEATURES.map((feature) => (
          <Link key={feature.href} href={feature.href} className="block">
            <Card className="h-full transition-shadow hover:shadow-none">
              <div className="flex items-start justify-between">
                <span className="text-2xl" aria-hidden="true">
                  {feature.icon}
                </span>
                {feature.live ? (
                  <Badge tone="grass">Live</Badge>
                ) : (
                  <Badge tone="neutral">Coming soon</Badge>
                )}
              </div>
              <h2 className="mt-3 font-display text-lg font-bold text-ink">{feature.title}</h2>
              <p className="mt-1 text-sm text-ink-soft">{feature.body}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
