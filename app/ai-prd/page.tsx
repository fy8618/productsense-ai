"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { ButtonLink } from "@/components/ButtonLink";
import { EvidenceUsed } from "@/components/EvidenceUsed";
import { useLanguage } from "@/components/LanguageProvider";
import { SectionHeader } from "@/components/SectionHeader";
import {
  ApprovalStatus,
  ExperimentBrief,
  getDefaultExperimentBrief,
  getDefaultPmReviewInputs,
  getEvidenceForOpportunity,
  getRelatedPainPoint,
  getSelectedAiOpportunity,
  loadAiWorkflow,
  PmReviewInputs,
  saveStoredAiWorkflow,
  StoredAiWorkflow
} from "@/lib/aiWorkflow";

export default function AiPrdPage() {
  const { language, t } = useLanguage();
  const [workflow, setWorkflow] = useState<StoredAiWorkflow | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [markdown, setMarkdown] = useState("");
  const [copyMessage, setCopyMessage] = useState("");

  useEffect(() => {
    setIsReady(false);
    setMarkdown("");
    setCopyMessage("");
    const storedWorkflow = loadAiWorkflow(language);

    if (storedWorkflow) {
      const preparedWorkflow = {
        ...storedWorkflow,
        pmReviewInputs: storedWorkflow.pmReviewInputs ?? getDefaultPmReviewInputs(storedWorkflow),
        approvalStatus: storedWorkflow.approvalStatus ?? "needs_review" as ApprovalStatus,
        experimentBrief: storedWorkflow.experimentBrief ?? getDefaultExperimentBrief(storedWorkflow)
      };
      saveStoredAiWorkflow(preparedWorkflow);
      setWorkflow(preparedWorkflow);
    } else {
      setWorkflow(null);
    }

    setIsReady(true);
  }, [language]);

  function updatePmInput(field: keyof PmReviewInputs, value: string) {
    if (!workflow) return;

    const currentInputs = workflow.pmReviewInputs ?? getDefaultPmReviewInputs(workflow);
    const updatedWorkflow = {
      ...workflow,
      pmReviewInputs: { ...currentInputs, [field]: value },
      approvalStatus: "needs_review" as ApprovalStatus
    };
    saveStoredAiWorkflow(updatedWorkflow);
    setWorkflow(updatedWorkflow);
    setMarkdown("");
    setCopyMessage("");
  }

  function updateApprovalStatus(status: ApprovalStatus) {
    if (!workflow) return;

    const updatedWorkflow = { ...workflow, approvalStatus: status };
    saveStoredAiWorkflow(updatedWorkflow);
    setWorkflow(updatedWorkflow);
    setMarkdown("");
    setCopyMessage("");
  }

  function updateExperimentField(field: keyof ExperimentBrief, value: string) {
    if (!workflow) return;

    const currentBrief = workflow.experimentBrief ?? getDefaultExperimentBrief(workflow);
    const updatedWorkflow = {
      ...workflow,
      experimentBrief: { ...currentBrief, [field]: value },
      approvalStatus: "needs_review" as ApprovalStatus
    };
    saveStoredAiWorkflow(updatedWorkflow);
    setWorkflow(updatedWorkflow);
    setMarkdown("");
    setCopyMessage("");
  }

  function exportMarkdown() {
    if (!workflow) return;
    setMarkdown(createPrdMarkdown(workflow, language));
    setCopyMessage("");
  }

  async function copyMarkdown() {
    if (!markdown) return;

    try {
      await navigator.clipboard.writeText(markdown);
      setCopyMessage(t("aiPrd.copied"));
    } catch {
      setCopyMessage(t("aiPrd.copyUnavailable"));
    }
  }

  if (!isReady) {
    return <AppShell><p className="text-sm text-ink/65">{t("aiPrd.loading")}</p></AppShell>;
  }

  const opportunity = workflow ? getSelectedAiOpportunity(workflow) : null;

  if (!workflow || !opportunity) {
    return (
      <AppShell>
        <SectionHeader
          eyebrow={t("aiPrd.eyebrow")}
          title={t("aiPrd.emptyTitle")}
          description={t("aiPrd.emptyDescription")}
        />
        <ButtonLink href="/ai-analysis">{t("aiPrd.goAnalysis")}</ButtonLink>
      </AppShell>
    );
  }

  const content = getPrdContent(workflow, language);
  const pmInputs = workflow.pmReviewInputs ?? getDefaultPmReviewInputs(workflow);
  const experimentBrief = workflow.experimentBrief ?? getDefaultExperimentBrief(workflow);
  const approvalStatus = workflow.approvalStatus ?? "needs_review";
  const evidence = getEvidenceForOpportunity(workflow);

  return (
    <AppShell>
      <SectionHeader
        eyebrow={t("aiPrd.eyebrow")}
        title={`${opportunity.title} PRD`}
        description={t("aiPrd.description")}
      />

      <div className="mb-6 rounded border border-ink/10 bg-white p-5 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-clay">{t("aiPrd.selected")}</p>
            <p className="mt-2 text-lg font-bold">{opportunity.title}</p>
          </div>
          <span className="rounded bg-gold/20 px-3 py-1 text-sm font-semibold text-ink">
            {workflow.source === "demo" ? t("aiAnalysis.demoLabel") : t("aiAnalysis.liveLabel")}
          </span>
        </div>
        <p className="mt-3 text-sm leading-6 text-ink/65">{t("workflow.label")} {t("workflow.full")}</p>
      </div>

      <section className="mb-6 rounded border border-ink/10 bg-white p-6 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-clay">{t("aiPrd.approval")}</p>
            <h2 className="mt-2 text-xl font-bold">{approvalStatus === "approved_for_prototype" ? t("aiPrd.approved") : t("aiPrd.needsReview")}</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => updateApprovalStatus("approved_for_prototype")}
              disabled={approvalStatus === "approved_for_prototype"}
              className="inline-flex items-center justify-center rounded bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-moss disabled:cursor-not-allowed disabled:bg-ink/35"
            >
              {t("aiPrd.markApproved")}
            </button>
            <button
              type="button"
              onClick={() => updateApprovalStatus("needs_review")}
              disabled={approvalStatus === "needs_review"}
              className="inline-flex items-center justify-center rounded border border-ink/15 bg-white px-5 py-3 text-sm font-semibold text-ink transition hover:border-moss hover:text-moss disabled:cursor-not-allowed disabled:opacity-40"
            >
              {t("aiPrd.resetReview")}
            </button>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_0.85fr]">
        <section className="rounded border border-ink/10 bg-white p-6 shadow-soft">
          <p className="text-sm font-semibold uppercase tracking-wide text-clay">{t("aiPrd.draftLabel")}</p>
          <h2 className="mt-2 text-2xl font-bold">{t("aiPrd.requirements")}</h2>
          <Info label={t("aiPrd.problem")} value={content.problemStatement} />
          <Info label={t("aiPrd.target")} value={content.targetUser} />
          <List title={t("aiPrd.userStories")} items={content.userStories} />
          <List title={t("aiPrd.scope")} items={content.mvpScope} />
          <List title={t("aiPrd.successMetrics")} items={content.successMetrics} />
        </section>

        <aside className="rounded border border-ink/10 bg-white p-6 shadow-soft">
          <h2 className="text-xl font-bold">{t("aiPrd.boundaries")}</h2>
          <List title={t("aiPrd.nonGoals")} items={content.nonGoals} />
          <List title={t("aiPrd.edgeCases")} items={content.edgeCases} />
          <List title={t("aiPrd.openQuestions")} items={content.openQuestions} />
          <div className="mt-6 rounded border border-clay/25 bg-clay/10 p-4 text-sm font-semibold leading-6 text-ink/75">
            {t("aiPrd.reminder")}
          </div>
        </aside>
      </div>

      <div className="mt-6">
        <EvidenceUsed items={evidence} source={workflow.source} />
      </div>

      <section className="mt-6 rounded border border-ink/10 bg-white p-6 shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-wide text-clay">{t("aiPrd.reviewInputs")}</p>
        <h2 className="mt-2 text-2xl font-bold">{t("aiPrd.businessContext")}</h2>
        <p className="mt-3 text-sm leading-6 text-ink/65">{t("aiPrd.autosave")}</p>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <TextField label={t("aiPrd.primarySegment")} value={pmInputs.primaryUserSegment} onChange={(value) => updatePmInput("primaryUserSegment", value)} />
          <TextField label={t("aiPrd.keyAssumption")} value={pmInputs.keyAssumption} onChange={(value) => updatePmInput("keyAssumption", value)} />
          <TextField label={t("aiPrd.successMetric")} value={pmInputs.successMetric} onChange={(value) => updatePmInput("successMetric", value)} />
          <TextField label={t("aiPrd.nonGoal")} value={pmInputs.nonGoal} onChange={(value) => updatePmInput("nonGoal", value)} />
          <TextField label={t("aiPrd.launchRisk")} value={pmInputs.launchRisk} onChange={(value) => updatePmInput("launchRisk", value)} />
          <TextField label={t("aiPrd.confidenceNote")} value={pmInputs.confidenceNote} onChange={(value) => updatePmInput("confidenceNote", value)} />
        </div>
      </section>

      <section className="mt-6 rounded border border-ink/10 bg-white p-6 shadow-soft">
        <h2 className="text-2xl font-bold">{t("experiment.title")}</h2>
        <p className="mt-3 text-sm leading-6 text-ink/65">{t("experiment.help")}</p>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <TextField label={t("experiment.hypothesis")} value={experimentBrief.hypothesis} onChange={(value) => updateExperimentField("hypothesis", value)} />
          <TextField label={t("experiment.primaryMetric")} value={experimentBrief.primaryMetric} onChange={(value) => updateExperimentField("primaryMetric", value)} />
          <TextField label={t("experiment.secondaryMetrics")} value={experimentBrief.secondaryMetrics} onChange={(value) => updateExperimentField("secondaryMetrics", value)} />
          <TextField label={t("experiment.guardrailMetric")} value={experimentBrief.guardrailMetric} onChange={(value) => updateExperimentField("guardrailMetric", value)} />
          <TextField label={t("experiment.testDesign")} value={experimentBrief.testDesign} onChange={(value) => updateExperimentField("testDesign", value)} />
          <TextField label={t("experiment.targetSegment")} value={experimentBrief.targetSegment} onChange={(value) => updateExperimentField("targetSegment", value)} />
          <TextField label={t("experiment.successCriteria")} value={experimentBrief.successCriteria} onChange={(value) => updateExperimentField("successCriteria", value)} />
          <TextField label={t("experiment.rolloutPlan")} value={experimentBrief.rolloutPlan} onChange={(value) => updateExperimentField("rolloutPlan", value)} />
          <TextField label={t("experiment.risks")} value={experimentBrief.risks} onChange={(value) => updateExperimentField("risks", value)} />
          <TextField label={t("experiment.decisionRule")} value={experimentBrief.decisionRule} onChange={(value) => updateExperimentField("decisionRule", value)} />
        </div>
      </section>

      <section className="mt-6 rounded border border-ink/10 bg-white p-6 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-clay">{t("aiPrd.portable")}</p>
            <h2 className="mt-2 text-2xl font-bold">{t("aiPrd.markdown")}</h2>
          </div>
          <button type="button" onClick={exportMarkdown} className="inline-flex items-center justify-center rounded bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-moss">
            {t("aiPrd.export")}
          </button>
        </div>
        {markdown && (
          <div className="mt-5">
            <label htmlFor="markdown-output" className="text-sm font-semibold">{t("aiPrd.generated")}</label>
            <textarea id="markdown-output" readOnly value={markdown} className="mt-2 min-h-80 w-full rounded border border-ink/15 bg-field px-4 py-3 font-mono text-sm leading-6" />
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <button type="button" onClick={copyMarkdown} className="inline-flex items-center justify-center rounded border border-ink/15 bg-white px-5 py-3 text-sm font-semibold text-ink transition hover:border-moss hover:text-moss">{t("aiPrd.copy")}</button>
              {copyMessage && <p className="text-sm text-ink/65">{copyMessage}</p>}
            </div>
          </div>
        )}
      </section>

      <div className="mt-6 flex flex-wrap gap-3">
        <ButtonLink href="/ai-evaluation">{t("aiPrd.evaluate")}</ButtonLink>
        <ButtonLink href="/ai-analysis" variant="secondary">{t("aiPrd.back")}</ButtonLink>
      </div>
    </AppShell>
  );
}

function getPrdContent(workflow: StoredAiWorkflow, language: "en" | "zh") {
  const opportunity = getSelectedAiOpportunity(workflow)!;
  const painPoint = getRelatedPainPoint(workflow);
  const pmInputs = workflow.pmReviewInputs ?? getDefaultPmReviewInputs(workflow);
  const isChinese = language === "zh";

  return {
    problemStatement: painPoint?.description ?? (isChinese ? `客户反馈显示“${opportunity.relatedPainPoint}”相关问题。在投入路线图资源前必须验证证据。` : `Customer feedback indicates a problem related to ${opportunity.relatedPainPoint}. The evidence must be validated before committing roadmap resources.`),
    targetUser: pmInputs.primaryUserSegment || opportunity.targetSegment,
    userStories: isChinese
      ? [`作为${pmInputs.primaryUserSegment || opportunity.targetSegment}的一员，我希望减少“${opportunity.relatedPainPoint}”带来的摩擦，从而更有信心地完成任务。`, "作为产品经理，我希望方案保留可追溯的客户证据，以便审核它是否真正解决问题。"]
      : [`As a member of ${pmInputs.primaryUserSegment || opportunity.targetSegment}, I want less friction related to ${opportunity.relatedPainPoint.toLowerCase()} so I can make progress with confidence.`, "As a product manager, I want the proposed experience to preserve traceable customer evidence so I can review whether it solves the stated problem."],
    mvpScope: isChinese
      ? [`围绕“${opportunity.title}”制作一个聚焦的体验原型。`, "在工程上线前与目标用户群测试原型。", "围绕原始痛点记录任务结果和定性反馈。"]
      : [`Prototype one focused experience for: ${opportunity.title}.`, "Test the prototype with the target segment before engineering rollout.", "Capture task outcomes and qualitative feedback against the original pain point."],
    successMetrics: (isChinese
      ? [pmInputs.successMetric, "PM 审核后的证据支持或否定主要机会假设。", `验证后重新检查 RICE 输入；当前 AI 信心为 ${opportunity.confidence}。`]
      : [pmInputs.successMetric, "PM-reviewed evidence supports or rejects the main opportunity assumption.", `RICE inputs are revisited after validation; current AI confidence is ${opportunity.confidence}.`]).filter(Boolean),
    nonGoals: (isChinese
      ? [pmInputs.nonGoal, "不对所选机会之外的体验进行大范围重设计。", "不使用 AI 建议替代 PM 判断。"]
      : [pmInputs.nonGoal, "A broad redesign beyond the selected opportunity.", "Replacing PM judgment with AI-generated recommendations."]).filter(Boolean),
    edgeCases: isChinese
      ? ["可用反馈较少或相互矛盾。", "不同客户群对问题的理解不同。", "方案提升了清晰度，但没有改善预期产品结果。"]
      : ["The available feedback is sparse or contradictory.", "Different customer segments interpret the problem differently.", "The proposed experience improves clarity but not the intended product outcome."],
    openQuestions: workflow.analysis.humanReview.openQuestions.length > 0
      ? Array.from(new Set(workflow.analysis.humanReview.openQuestions))
      : [isChinese ? "未生成开放问题，需要 PM 审核并补充。" : "No open questions were generated. PM review is required to add them."]
  };
}

function createPrdMarkdown(workflow: StoredAiWorkflow, language: "en" | "zh") {
  const content = getPrdContent(workflow, language);
  const pmInputs = workflow.pmReviewInputs ?? getDefaultPmReviewInputs(workflow);
  const experimentBrief = workflow.experimentBrief ?? getDefaultExperimentBrief(workflow);
  const evidence = getEvidenceForOpportunity(workflow);
  const isChinese = language === "zh";
  const sourceLabel = workflow.source === "demo" ? (isChinese ? "演示备用证据" : "Demo fallback evidence") : (isChinese ? "用户提供的证据" : "User-provided evidence");
  const list = (items: string[]) => items.map((item) => `- ${item}`).join("\n");
  const evidenceMarkdown = evidence.length > 0
    ? evidence.map((item) => isChinese
      ? `- “${item.quote}”\n  - 支持的痛点：${item.painPoint}\n  - 支持的机会：${item.opportunity}\n  - 来源：${sourceLabel}`
      : `- \"${item.quote}\"\n  - Supports pain point: ${item.painPoint}\n  - Supports opportunity: ${item.opportunity}\n  - Source: ${sourceLabel}`).join("\n")
    : (isChinese ? "未找到直接证据，需要人工审核。" : "No direct evidence found. Human review required.");

  if (isChinese) {
    return `# ProductSense AI PRD 草稿

## 问题陈述
${content.problemStatement}

## 目标用户
${content.targetUser}

## 用户故事
${list(content.userStories)}

## MVP 范围
${list(content.mvpScope)}

## 成功指标
${list(content.successMetrics)}

## 非目标
${list(content.nonGoals)}

## 边界情况
${list(content.edgeCases)}

## 开放问题
${list(content.openQuestions)}

## 使用的证据
${evidenceMarkdown}

## PM 审核输入
- 主要用户群：${pmInputs.primaryUserSegment}
- 关键假设：${pmInputs.keyAssumption}
- 成功指标：${pmInputs.successMetric}
- 非目标：${pmInputs.nonGoal}
- 发布风险：${pmInputs.launchRisk}
- PM 信心说明：${pmInputs.confidenceNote}
- 草稿状态：${workflow.approvalStatus === "approved_for_prototype" ? "已批准进入原型验证" : "需要 PM 审核"}

## 实验简报
- 假设：${experimentBrief.hypothesis}
- 主要指标：${experimentBrief.primaryMetric}
- 次要指标：${experimentBrief.secondaryMetrics}
- 护栏指标：${experimentBrief.guardrailMetric}
- 测试设计：${experimentBrief.testDesign}
- 目标用户群：${experimentBrief.targetSegment}
- 成功标准：${experimentBrief.successCriteria}
- 上线计划：${experimentBrief.rolloutPlan}
- 风险：${experimentBrief.risks}
- 决策规则：${experimentBrief.decisionRule}

## 人工审核提醒
AI 创建了初稿。PM 必须验证证据、假设、范围、指标和风险后，才能信任此 PRD。`;
  }

  return `# ProductSense AI PRD Draft

## Problem Statement

${content.problemStatement}

## Target User

${content.targetUser}

## User Stories

${list(content.userStories)}

## MVP Scope

${list(content.mvpScope)}

## Success Metrics

${list(content.successMetrics)}

## Non-goals

${list(content.nonGoals)}

## Edge Cases

${list(content.edgeCases)}

## Open Questions

${list(content.openQuestions)}

## Evidence Used

${evidenceMarkdown}

## PM Review Inputs

- Primary user segment: ${pmInputs.primaryUserSegment}
- Key assumption: ${pmInputs.keyAssumption}
- Success metric: ${pmInputs.successMetric}
- Non-goal: ${pmInputs.nonGoal}
- Launch risk: ${pmInputs.launchRisk}
- PM confidence note: ${pmInputs.confidenceNote}
- Draft status: ${workflow.approvalStatus === "approved_for_prototype" ? "Approved for prototype" : "Needs PM review"}

## Experiment Brief

- Hypothesis: ${experimentBrief.hypothesis}
- Primary metric: ${experimentBrief.primaryMetric}
- Secondary metrics: ${experimentBrief.secondaryMetrics}
- Guardrail metric: ${experimentBrief.guardrailMetric}
- Test design: ${experimentBrief.testDesign}
- Target segment: ${experimentBrief.targetSegment}
- Success criteria: ${experimentBrief.successCriteria}
- Rollout plan: ${experimentBrief.rolloutPlan}
- Risks: ${experimentBrief.risks}
- Decision rule: ${experimentBrief.decisionRule}

## Human Review Reminder

AI created the first draft. A PM must validate the evidence, assumptions, scope, metrics, and risks before this PRD is trusted.`;
}

function TextField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label className="block text-sm font-semibold">{label}<textarea value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 min-h-28 w-full rounded border border-ink/15 px-4 py-3 text-sm font-normal leading-6" /></label>;
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="mt-5 rounded bg-field p-4"><p className="text-sm font-semibold text-ink/60">{label}</p><p className="mt-2 text-sm leading-6 text-ink/75">{value}</p></div>;
}

function List({ title, items }: { title: string; items: string[] }) {
  return <div className="mt-6"><h3 className="font-bold">{title}</h3><ul className="mt-3 space-y-2">{items.map((item) => <li key={item} className="rounded bg-field px-4 py-3 text-sm leading-6 text-ink/75">{item}</li>)}</ul></div>;
}
