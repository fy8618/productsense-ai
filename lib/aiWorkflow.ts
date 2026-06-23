import { AiAnalysisResult } from "@/lib/aiAnalysis";

export const aiWorkflowStorageKey = "productsense-ai-workflow";

export type AiResultSource = "live" | "demo";

export type PmReviewInputs = {
  primaryUserSegment: string;
  keyAssumption: string;
  successMetric: string;
  nonGoal: string;
  launchRisk: string;
  confidenceNote: string;
};

export type RiceInputs = {
  reach: string;
  impact: string;
  confidence: string;
  effort: string;
};

export type ApprovalStatus = "needs_review" | "approved_for_prototype";

export type ExperimentBrief = {
  hypothesis: string;
  primaryMetric: string;
  secondaryMetrics: string;
  guardrailMetric: string;
  testDesign: string;
  targetSegment: string;
  successCriteria: string;
  rolloutPlan: string;
  risks: string;
  decisionRule: string;
};

export type StoredAiWorkflow = {
  analysis: AiAnalysisResult;
  selectedOpportunityId: string;
  source: AiResultSource;
  language?: "en" | "zh";
  savedAt: string;
  pmReviewInputs?: PmReviewInputs;
  riceInputs?: RiceInputs;
  approvalStatus?: ApprovalStatus;
  experimentBrief?: ExperimentBrief;
};

export type EvidenceItem = {
  quote: string;
  painPoint: string;
  opportunity: string;
};

export function saveAiWorkflow(
  analysis: AiAnalysisResult,
  selectedOpportunityId: string,
  source: AiResultSource,
  language: "en" | "zh" = "en"
) {
  const workflow: StoredAiWorkflow = {
    analysis,
    selectedOpportunityId,
    source,
    language,
    savedAt: new Date().toISOString()
  };

  localStorage.setItem(aiWorkflowStorageKey, JSON.stringify(workflow));
}

export function loadAiWorkflow(language: "en" | "zh" = "en"): StoredAiWorkflow | null {
  const storedValue = localStorage.getItem(aiWorkflowStorageKey);

  if (!storedValue) return null;

  try {
    const workflow = JSON.parse(storedValue) as StoredAiWorkflow;
    const opportunityExists = workflow.analysis?.opportunities?.some(
      (opportunity) => opportunity.id === workflow.selectedOpportunityId
    );

    const workflowLanguage = workflow.language ?? "en";
    return opportunityExists && workflowLanguage === language ? workflow : null;
  } catch {
    return null;
  }
}

export function saveStoredAiWorkflow(workflow: StoredAiWorkflow) {
  localStorage.setItem(
    aiWorkflowStorageKey,
    JSON.stringify({ ...workflow, savedAt: new Date().toISOString() })
  );
}

export function getSelectedAiOpportunity(workflow: StoredAiWorkflow) {
  return workflow.analysis.opportunities.find(
    (opportunity) => opportunity.id === workflow.selectedOpportunityId
  );
}

export function getRelatedPainPoint(workflow: StoredAiWorkflow) {
  const opportunity = getSelectedAiOpportunity(workflow);

  return workflow.analysis.painPoints.find(
    (painPoint) =>
      painPoint.id === opportunity?.relatedPainPoint ||
      painPoint.title.toLowerCase() === opportunity?.relatedPainPoint.toLowerCase()
  );
}

export function getEvidenceForOpportunity(workflow: StoredAiWorkflow): EvidenceItem[] {
  const opportunity = getSelectedAiOpportunity(workflow);
  const painPoint = getRelatedPainPoint(workflow);

  if (!opportunity || !painPoint) return [];

  return painPoint.evidenceQuotes.map((quote) => ({
    quote,
    painPoint: painPoint.title,
    opportunity: opportunity.title
  }));
}

export function getDefaultPmReviewInputs(workflow: StoredAiWorkflow): PmReviewInputs {
  const opportunity = getSelectedAiOpportunity(workflow);
  const firstRisk = workflow.analysis.risks[0];
  const isChinese = workflow.language === "zh";

  return {
    primaryUserSegment: opportunity?.targetSegment ?? "",
    keyAssumption: workflow.analysis.humanReview.assumptionsToVerify[0] ?? "",
    successMetric: isChinese ? "在扩大原型范围前，先与目标用户群验证主要结果。" : "Validate the primary outcome with the target segment before prototype expansion.",
    nonGoal: isChinese ? "不自动承诺路线图或生产发布。" : "Automatic roadmap commitment or production launch.",
    launchRisk: firstRisk ? `${firstRisk.title}：${firstRisk.description}` : isChinese ? "确定发布风险前需要人工审核。" : "Human review is required before identifying a launch risk.",
    confidenceNote: opportunity ? (isChinese ? `AI 信心输入：${opportunity.confidence}。仍需 PM 验证。` : `AI confidence input: ${opportunity.confidence}. PM validation is still required.`) : ""
  };
}

export function getDefaultRiceInputs(workflow: StoredAiWorkflow): RiceInputs {
  const opportunity = getSelectedAiOpportunity(workflow);

  return {
    reach: directionalScore(opportunity?.reach),
    impact: directionalScore(opportunity?.impact),
    confidence: percentageScore(opportunity?.confidence),
    effort: directionalScore(opportunity?.effort)
  };
}

export function getDefaultExperimentBrief(workflow: StoredAiWorkflow): ExperimentBrief {
  const opportunity = getSelectedAiOpportunity(workflow);
  const pmInputs = workflow.pmReviewInputs ?? getDefaultPmReviewInputs(workflow);
  const firstRisk = workflow.analysis.risks[0];
  const isChinese = workflow.language === "zh";

  return {
    hypothesis: opportunity ? (isChinese ? `如果我们为“${opportunity.title}”制作原型，目标用户群将更有信心地完成相关任务。` : `If we prototype ${opportunity.title.toLowerCase()}, then the target segment will complete the related task with greater confidence.`) : "",
    primaryMetric: pmInputs.successMetric,
    secondaryMetrics: isChinese ? "任务完成率；定性理解评分" : "Task completion rate; qualitative comprehension score",
    guardrailMetric: isChinese ? "客服请求或用户报告的困惑不增加" : "No increase in support requests or user-reported confusion",
    testDesign: isChinese ? "先开展有主持的原型测试，再进行小规模对照产品实验。" : "Run a moderated prototype test followed by a small controlled product experiment.",
    targetSegment: pmInputs.primaryUserSegment || opportunity?.targetSegment || "",
    successCriteria: isChinese ? "主要指标改善，并且 PM 审核后的证据支持该假设。" : "The primary metric improves and PM-reviewed evidence supports the hypothesis.",
    rolloutPlan: isChinese ? "先制作原型，与目标用户群验证后，再考虑有限范围上线。" : "Prototype first, validate with the target segment, then consider a limited rollout.",
    risks: pmInputs.launchRisk || firstRisk?.description || (isChinese ? "发布前需要人工审核。" : "Human review is required before launch."),
    decisionRule: isChinese ? "仅当主要指标改善且未触发护栏指标时推进；否则修改方案或停止。" : "Proceed only if the primary metric improves without breaching the guardrail metric. Otherwise revise or stop."
  };
}

function directionalScore(value?: string) {
  if (!value) return "1";

  const numericValue = Number.parseFloat(value);
  if (Number.isFinite(numericValue)) return String(numericValue);

  if (/high|高/i.test(value)) return "5";
  if (/medium|moderate|中/i.test(value)) return "3";
  return "1";
}

function percentageScore(value?: string) {
  if (!value) return "50";

  const percentage = value.match(/\d+(?:\.\d+)?/);
  if (percentage) return percentage[0];

  if (/high/i.test(value)) return "85";
  if (/medium|moderate/i.test(value)) return "65";
  return "40";
}
