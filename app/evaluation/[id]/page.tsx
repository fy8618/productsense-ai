import { MockEvaluationView } from "@/components/MockWorkflowViews";

export default function DynamicEvaluationPage({ params }: { params: { id: string } }) {
  return <MockEvaluationView id={params.id} />;
}
