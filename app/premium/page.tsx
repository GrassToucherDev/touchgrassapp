import { PageHeader } from "@/components/shell/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";

export default function PremiumPage() {
  return (
    <div className="pb-10">
      <PageHeader title="Premium+" />
      <div className="mt-6 px-4 sm:px-8">
        <EmptyState
          icon="⭐"
          title="Premium+ is coming soon"
          body="Unlock enhanced themes and ecosystem perks. This section isn't built yet."
        />
      </div>
    </div>
  );
}
