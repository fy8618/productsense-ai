import { MockPrdView } from "@/components/MockWorkflowViews";

export default function DynamicPrdPage({ params }: { params: { id: string } }) {
  return <MockPrdView id={params.id} />;
}
