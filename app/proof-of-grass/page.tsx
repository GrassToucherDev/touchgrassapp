import { PageHeader } from "@/components/shell/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";

export default function ProofOfGrassPage() {
  return (
    <div className="pb-10">
      <PageHeader title="Proof of Grass" />
      <div className="mt-6 px-4 sm:px-8">
        <EmptyState
          icon="🌿"
          title="Proof of Grass is coming soon"
          body="Log real outdoor time and turn it into on-chain proof. This section isn't built yet."
        />
      </div>
    </div>
  );
}
