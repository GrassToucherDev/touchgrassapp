import { PageHeader } from "@/components/shell/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";

export default function LeaderboardPage() {
  return (
    <div className="pb-10">
      <PageHeader title="Leaderboard" />
      <div className="mt-6 px-4 sm:px-8">
        <EmptyState
          icon="🏆"
          title="Leaderboard is coming soon"
          body="See how your season stacks up against the community. This section isn't built yet."
        />
      </div>
    </div>
  );
}
