import { MockOpportunityView } from "@/components/MockWorkflowViews";

export default function OpportunityDetailPage({ params }: { params: { id: string } }) {
  return <MockOpportunityView id={params.id} />;
}
