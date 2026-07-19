import { PageHeader } from "@/components/shell/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";

export default function QuestsPage() {
  return (
    <div className="pb-10">
      <PageHeader title="Quests" />
      <div className="mt-6 px-4 sm:px-8">
        <EmptyState
          icon="🧭"
          title="Quests are coming soon"
          body="Complete challenges to earn seasonal rewards. This section isn't built yet."
        />
      </div>
    </div>
  );
}
