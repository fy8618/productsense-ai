"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { ButtonLink } from "@/components/ButtonLink";
import { EvidenceUsed } from "@/components/EvidenceUsed";
import { useLanguage } from "@/components/LanguageProvider";
import { SectionHeader } from "@/components/SectionHeader";
import {
  aiWorkflowStorageKey,
  getDefaultExperimentBrief,
  getDefaultPmReviewInputs,
  getDefaultRiceInputs,
  getEvidenceForOpportunity,
  getRelatedPainPoint,
  getSelectedAiOpportunity,
  loadAiWorkflow,
  RiceInputs,
  saveStoredAiWorkflow,
  StoredAiWorkflow
} from "@/lib/aiWorkflow";
import { getLocalizedLevel } from "@/lib/mockData";

export default function AiEvaluationPage() {
  const router = useRouter();
  const { language, t } = useLanguage();
  const [workflow, setWorkflow] = useState<StoredAiWorkflow | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(false);
    const storedWorkflow = loadAiWorkflow(language);

    if (storedWorkflow) {
      const preparedWorkflow = {
        ...storedWorkflow,
        riceInputs: storedWorkflow.riceInputs ?? getDefaultRiceInputs(storedWorkflow),
        approvalStatus: storedWorkflow.approvalStatus ?? "needs_review" as const
      };
      saveStoredAiWorkflow(preparedWorkflow);
      setWorkflow(preparedWorkflow);
    } else {
      setWorkflow(null);
    }

    setIsReady(true);
  }, [language]);

  function updateRiceInput(field: keyof RiceInputs, value: string) {
    if (!workflow) return;

    const currentInputs = workflow.riceInputs ?? getDefaultRiceInputs(workflow);
    const updatedWorkflow = {
      ...workflow,
      riceInputs: { ...currentInputs, [field]: value }
    };
    saveStoredAiWorkflow(updatedWorkflow);
    setWorkflow(updatedWorkflow);
  }

  function startAnotherAnalysis() {
    localStorage.removeItem(aiWorkflowStorageKey);
    router.push("/ai-analysis");
  }

  if (!isReady) {
    return <AppShell><p className="text-sm text-ink/65">{t("aiPrd.loading")}</p></AppShell>;
  }

  const opportunity = workflow ? getSelectedAiOpportunity(workflow) : null;

  if (!workflow || !opportunity) {
    return (
      <AppShell>
        <SectionHeader
          eyebrow={t("aiEvaluation.eyebrow")}
          title={t("aiPrd.emptyTitle")}
          description={t("aiPrd.emptyDescription")}
        />
        <ButtonLink href="/ai-analysis">{t("aiPrd.goAnalysis")}</ButtonLink>
      </AppShell>
    );
  }

  const relatedPainPoint = getRelatedPainPoint(workflow);
  const evidence = getEvidenceForOpportunity(workflow);
  const evidenceCount = evidence.length;
  const confidenceIsLow = /low|低|[0-4][0-9]%/i.test(opportunity.confidence);
  const unsupportedClaimRisk = confidenceIsLow || evidenceCount < 2 ? "High" : "Medium";
  const riceInputs = workflow.riceInputs ?? getDefaultRiceInputs(workflow);
  const riceCalculation = calculateRiceScore(riceInputs);
  const approvalStatus = workflow.approvalStatus === "approved_for_prototype" ? t("aiPrd.approved") : t("aiPrd.needsReview");
  const pmChanges = getPmChanges(workflow, t);

  return (
    <AppShell>
      <SectionHeader
        eyebrow={t("aiEvaluation.eyebrow")}
        title={t("aiEvaluation.title")}
        description={t("aiEvaluation.description")}
      />

      <section className="rounded border border-ink/10 bg-white p-6 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-clay">{t("aiPrd.selected")}</p>
            <h2 className="mt-2 text-xl font-bold">{opportunity.title}</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded bg-gold/20 px-3 py-1 text-sm font-semibold text-ink">{workflow.source === "demo" ? t("aiAnalysis.demoLabel") : t("aiAnalysis.liveLabel")}</span>
            <span className={`rounded px-3 py-1 text-sm font-semibold ${workflow.approvalStatus === "approved_for_prototype" ? "bg-moss text-white" : "bg-clay/10 text-clay"}`}>{approvalStatus}</span>
          </div>
        </div>
        <p className="mt-3 text-sm leading-6 text-ink/65">{t("workflow.label")} {t("workflow.full")}</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Metric label={t("aiEvaluation.evidenceCoverage")} value={`${evidenceCount} ${t("aiEvaluation.directQuotes")}`} detail={t("aiEvaluation.evidenceDetail")} />
          <Metric label={t("aiEvaluation.unsupportedRisk")} value={language === "zh" ? (unsupportedClaimRisk === "High" ? "高" : "中") : unsupportedClaimRisk} detail={t("aiEvaluation.unsupportedDetail")} />
          <Metric label={t("aiEvaluation.confidenceScore")} value={opportunity.confidence} detail={t("aiEvaluation.confidenceDetail")} />
          <Metric label={t("aiAnalysis.reviewRequired")} value={workflow.analysis.humanReview.required ? (language === "zh" ? "是" : "Yes") : (language === "zh" ? "否" : "No")} detail={t("aiEvaluation.humanReviewDetail")} />
        </div>
      </section>

      <section className="mt-6 rounded border border-ink/10 bg-white p-6 shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-wide text-clay">{t("aiEvaluation.rice")}</p>
        <h2 className="mt-2 text-2xl font-bold">{t("aiEvaluation.reviewInputs")}</h2>
        <p className="mt-3 text-sm leading-6 text-ink/65">{t("aiEvaluation.riceHelp")}</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <NumberField label={t("aiEvaluation.reach")} value={riceInputs.reach} onChange={(value) => updateRiceInput("reach", value)} min="0" />
          <NumberField label={t("aiEvaluation.impact")} value={riceInputs.impact} onChange={(value) => updateRiceInput("impact", value)} min="0" />
          <NumberField label={t("aiEvaluation.confidence")} value={riceInputs.confidence} onChange={(value) => updateRiceInput("confidence", value)} min="0" max="100" />
          <NumberField label={t("aiEvaluation.effort")} value={riceInputs.effort} onChange={(value) => updateRiceInput("effort", value)} min="0.1" />
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Metric label={t("aiEvaluation.aiRice")} value={opportunity.riceScore} detail={t("aiEvaluation.aiRiceDetail")} />
          <Metric label={t("aiEvaluation.pmRice")} value={riceCalculation.score ?? t("aiEvaluation.cannotCalculate")} detail={language === "zh" ? "覆盖范围 x 影响 x (信心 / 100) / 投入" : "Reach x Impact x (Confidence / 100) / Effort"} />
        </div>
        {riceCalculation.errorKey && <p className="mt-4 rounded border border-clay/25 bg-clay/10 p-4 text-sm font-semibold text-clay">{t(riceCalculation.errorKey)}</p>}
      </section>

      <div className="mt-6">
        <EvidenceUsed items={evidence} source={workflow.source} />
      </div>

      <section className="mt-6 rounded border border-ink/10 bg-white p-6 shadow-soft">
        <h2 className="text-2xl font-bold">{t("history.title")}</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <HistoryItem label={t("history.aiSuggested")} value={`${opportunity.recommendation} AI RICE: ${opportunity.riceScore}.`} />
          <HistoryItem label={t("history.pmChanged")} value={pmChanges.length > 0 ? pmChanges.join(language === "zh" ? "；" : "; ") : t("history.noChanges")} />
          <HistoryItem label={t("history.approval")} value={approvalStatus} />
          <HistoryItem label={t("history.rice")} value={riceCalculation.score ?? t("aiEvaluation.cannotCalculate")} />
          <HistoryItem label={t("history.evidence")} value={evidence[0]?.quote ?? t("evidence.none")} />
          <HistoryItem label={t("history.questions")} value={workflow.analysis.humanReview.openQuestions.join(language === "zh" ? "；" : "; ") || t("evidence.none")} />
        </div>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded border border-ink/10 bg-white p-6 shadow-soft">
          <h2 className="text-xl font-bold">{t("aiEvaluation.keyRisks")}</h2>
          <div className="mt-5 space-y-4">
            {workflow.analysis.risks.map((risk) => (
              <article key={risk.title} className="rounded border border-ink/10 p-5">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-bold">{risk.title}</h3>
                  <span className="rounded bg-clay/10 px-3 py-1 text-sm font-semibold text-clay">{getLocalizedLevel(language, risk.level)}</span>
                </div>
                <p className="mt-3 text-sm leading-6 text-ink/70">{risk.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded border border-ink/10 bg-white p-6 shadow-soft">
          <List title={t("aiEvaluation.assumptions")} items={workflow.analysis.humanReview.assumptionsToVerify} />
          <List title={t("aiEvaluation.openQuestions")} items={workflow.analysis.humanReview.openQuestions} />
          <div className="mt-6 rounded bg-moss p-5 text-white">
            <p className="text-sm font-semibold uppercase tracking-wide text-white/75">{t("aiEvaluation.recommendation")}</p>
            <p className="mt-2 text-xl font-bold">{t("aiEvaluation.proceed")}</p>
            <p className="mt-2 text-sm leading-6 text-white/80">{language === "zh" ? `${t("aiPrd.approval")}：${approvalStatus}。${t("aiEvaluation.statusWarning")}` : `${t("aiPrd.approval")}: ${approvalStatus}. ${t("aiEvaluation.statusWarning")}`}</p>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink href="/ai-prd" variant="secondary">{t("aiEvaluation.back")}</ButtonLink>
            <button type="button" onClick={startAnotherAnalysis} className="inline-flex items-center justify-center rounded bg-ink px-5 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-moss">{t("aiEvaluation.restart")}</button>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function getPmChanges(workflow: StoredAiWorkflow, t: (key: string) => string) {
  const changes: string[] = [];
  const defaultPmInputs = getDefaultPmReviewInputs(workflow);
  const pmInputs = workflow.pmReviewInputs ?? defaultPmInputs;
  const pmFields: Array<[keyof typeof pmInputs, string]> = [
    ["primaryUserSegment", "aiPrd.primarySegment"], ["keyAssumption", "aiPrd.keyAssumption"],
    ["successMetric", "aiPrd.successMetric"], ["nonGoal", "aiPrd.nonGoal"],
    ["launchRisk", "aiPrd.launchRisk"], ["confidenceNote", "aiPrd.confidenceNote"]
  ];
  pmFields.forEach(([field, labelKey]) => { if (pmInputs[field] !== defaultPmInputs[field]) changes.push(t(labelKey)); });

  const defaultRice = getDefaultRiceInputs(workflow);
  const rice = workflow.riceInputs ?? defaultRice;
  const riceFields: Array<[keyof RiceInputs, string]> = [
    ["reach", "aiEvaluation.reach"], ["impact", "aiEvaluation.impact"],
    ["confidence", "aiEvaluation.confidence"], ["effort", "aiEvaluation.effort"]
  ];
  riceFields.forEach(([field, labelKey]) => { if (rice[field] !== defaultRice[field]) changes.push(`${t(labelKey)}: ${defaultRice[field]} -> ${rice[field]}`); });

  const defaultExperiment = getDefaultExperimentBrief(workflow);
  const experiment = workflow.experimentBrief ?? defaultExperiment;
  const experimentFields: Array<[keyof typeof experiment, string]> = [
    ["hypothesis", "experiment.hypothesis"], ["primaryMetric", "experiment.primaryMetric"],
    ["secondaryMetrics", "experiment.secondaryMetrics"], ["guardrailMetric", "experiment.guardrailMetric"],
    ["testDesign", "experiment.testDesign"], ["targetSegment", "experiment.targetSegment"],
    ["successCriteria", "experiment.successCriteria"], ["rolloutPlan", "experiment.rolloutPlan"],
    ["risks", "experiment.risks"], ["decisionRule", "experiment.decisionRule"]
  ];
  experimentFields.forEach(([field, labelKey]) => { if (experiment[field] !== defaultExperiment[field]) changes.push(t(labelKey)); });

  return changes;
}

function calculateRiceScore(inputs: RiceInputs) {
  const reach = Number(inputs.reach);
  const impact = Number(inputs.impact);
  const confidence = Number(inputs.confidence);
  const effort = Number(inputs.effort);

  if (![reach, impact, confidence, effort].every(Number.isFinite) || reach < 0 || impact < 0 || confidence < 0) {
    return { score: null, errorKey: "aiEvaluation.invalidNumbers" };
  }

  if (confidence > 100) {
    return { score: null, errorKey: "aiEvaluation.invalidConfidence" };
  }

  if (effort <= 0) {
    return { score: null, errorKey: "aiEvaluation.invalidEffort" };
  }

  const score = reach * impact * (confidence / 100) / effort;
  return { score: score.toFixed(2), errorKey: "" };
}

function NumberField({ label, value, onChange, min, max }: { label: string; value: string; onChange: (value: string) => void; min: string; max?: string }) {
  return <label className="block text-sm font-semibold">{label}<input type="number" step="any" min={min} max={max} value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full rounded border border-ink/15 px-4 py-3 text-sm font-normal" /></label>;
}

function HistoryItem({ label, value }: { label: string; value: string }) {
  return <article className="rounded border border-ink/10 bg-field p-4"><p className="text-sm font-semibold text-ink/60">{label}</p><p className="mt-2 text-sm leading-6 text-ink/75">{value}</p></article>;
}

function Metric({ label, value, detail }: { label: string; value: string; detail: string }) {
  return <article className="rounded border border-ink/10 bg-field p-4"><p className="text-sm font-semibold text-ink/60">{label}</p><p className="mt-2 text-xl font-bold">{value}</p><p className="mt-2 text-sm leading-6 text-ink/65">{detail}</p></article>;
}

function List({ title, items }: { title: string; items: string[] }) {
  const { t } = useLanguage();
  return <div className="mt-5 first:mt-0"><h3 className="font-bold">{title}</h3><ul className="mt-3 space-y-2">{items.length > 0 ? items.map((item) => <li key={item} className="rounded bg-field px-4 py-3 text-sm leading-6 text-ink/75">{item}</li>) : <li className="rounded bg-field px-4 py-3 text-sm leading-6 text-clay">{t("aiEvaluation.noItems")}</li>}</ul></div>;
}
