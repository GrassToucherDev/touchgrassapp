import { PageHeader } from "@/components/shell/PageHeader";
import { DashboardContent } from "@/components/dashboard/DashboardContent";

export default function DashboardPage() {
  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Your Touch Grass ecosystem, in one place." />
      <DashboardContent />
    </div>
  );
}
