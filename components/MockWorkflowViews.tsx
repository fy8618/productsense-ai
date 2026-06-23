"use client";

import { AppShell } from "@/components/AppShell";
import { ButtonLink } from "@/components/ButtonLink";
import { useLanguage } from "@/components/LanguageProvider";
import { SectionHeader } from "@/components/SectionHeader";
import { getLocalizedLevel, getMockData } from "@/lib/mockData";

const copy = {
  en: {
    step3: "Step 3", opportunityDescription: "Inspect the opportunity, evidence, assumptions, and prioritization score before drafting a PRD.", opportunityBrief: "Opportunity brief", problem: "Problem", targetSegment: "Target segment", evidenceSignal: "Evidence signal", expectedOutcome: "Expected outcome", humanReview: "Human review", riskLevel: "Risk level", assumptions: "Key assumptions", openQuestions: "Open questions", verify: "PM should verify", generatePrd: "Generate PRD draft", riceScore: "RICE score", riceHelp: "RICE = Reach x Impact x Confidence / Effort. Higher scores suggest stronger candidates, but PM review is still required.", reach: "Reach", impact: "Impact", confidence: "Confidence", effort: "Effort", weeks: "wks", finalScore: "Final score", evidenceQuotes: "Evidence quotes",
    step4: "Step 4", prdDescription: "This mock PRD uses the selected opportunity's localized scope, metrics, and experiment plan.", selected: "Selected opportunity", flow: "Flow: Upload mock feedback - Analyze pain points - Choose an opportunity - Review PRD draft - Evaluate risks and metrics.", prdDraft: "PRD draft", problemStatement: "Problem statement", targetUser: "Target user", userStories: "User stories", mvpScope: "MVP scope", successMetrics: "Success metrics", nonGoals: "Non-goals", edgeCases: "Edge cases", experimentPlan: "Experiment plan", testOutline: "Test outline", hypothesis: "Hypothesis", audience: "Audience", duration: "Duration", variants: "Variants", guardrails: "Guardrails", evaluate: "Evaluate risks and metrics",
    step5: "Step 5", evaluationTitle: "Risk-aware decision review", evaluationDescription: "Review confidence, unsupported-claim risk, metrics, and recommendations for the selected opportunity.", riskFlags: "Risk flags", evaluationMetrics: "Evaluation metrics", metric: "Metric", baseline: "Baseline", target: "Target", owner: "Owner", recommendation: "Decision recommendation", backDashboard: "Back to dashboard", reviewPrd: "Review PRD draft"
  },
  zh: {
    step3: "步骤 3", opportunityDescription: "在起草 PRD 前，审核机会、证据、假设和优先级分数。", opportunityBrief: "机会简报", problem: "问题", targetSegment: "目标用户群", evidenceSignal: "证据信号", expectedOutcome: "预期结果", humanReview: "人工审核", riskLevel: "风险等级", assumptions: "关键假设", openQuestions: "开放问题", verify: "PM 应验证", generatePrd: "生成 PRD 草稿", riceScore: "RICE 分数", riceHelp: "RICE = 覆盖范围 x 影响 x 信心 / 投入。分数越高通常越值得优先考虑，但仍需 PM 审核。", reach: "覆盖范围", impact: "影响", confidence: "信心", effort: "投入", weeks: "周", finalScore: "最终分数", evidenceQuotes: "证据引用",
    step4: "步骤 4", prdDescription: "此模拟 PRD 使用所选机会的本地化范围、指标和实验计划。", selected: "已选择机会", flow: "流程：上传模拟反馈 - 分析痛点 - 选择机会 - 审核 PRD 草稿 - 评估风险和指标。", prdDraft: "PRD 草稿", problemStatement: "问题陈述", targetUser: "目标用户", userStories: "用户故事", mvpScope: "MVP 范围", successMetrics: "成功指标", nonGoals: "非目标", edgeCases: "边界情况", experimentPlan: "实验计划", testOutline: "测试概要", hypothesis: "假设", audience: "实验用户", duration: "持续时间", variants: "实验版本", guardrails: "护栏指标", evaluate: "评估风险和指标",
    step5: "步骤 5", evaluationTitle: "风险感知决策审核", evaluationDescription: "审核所选机会的信心、无依据主张风险、指标和建议。", riskFlags: "风险标记", evaluationMetrics: "评估指标", metric: "指标", baseline: "基线", target: "目标", owner: "负责人", recommendation: "决策建议", backDashboard: "返回仪表盘", reviewPrd: "审核 PRD 草稿"
  }
};

export function MockOpportunityView({ id }: { id: string }) {
  const { language } = useLanguage();
  const text = copy[language];
  const { opportunities, painClusters } = getMockData(language);
  const opportunity = opportunities.find((item) => item.id === id) ?? opportunities[0];
  const cluster = painClusters.find((item) => item.id === opportunity.painPointId) ?? painClusters[0];
  const humanReview = opportunity.humanReview;

  return (
    <AppShell>
      <SectionHeader eyebrow={text.step3} title={opportunity.title} description={text.opportunityDescription} />
      <div className="grid gap-6 lg:grid-cols-[1fr_0.85fr]">
        <section className="rounded border border-ink/10 bg-white p-6 shadow-soft">
          <h2 className="text-xl font-bold">{text.opportunityBrief}</h2>
          <Info label={text.problem} value={opportunity.problem} />
          <Info label={text.targetSegment} value={opportunity.targetSegment} />
          <Info label={text.evidenceSignal} value={opportunity.evidenceSummary} />
          <Info label={text.expectedOutcome} value={opportunity.expectedOutcome} />
          <section className="mt-5 rounded border border-ink/10 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3"><h3 className="text-lg font-bold">{text.humanReview}</h3><span className="rounded bg-clay/10 px-3 py-1 text-sm font-semibold text-clay">{text.riskLevel}：{getLocalizedLevel(language, humanReview.riskLevel)}</span></div>
            <List title={text.assumptions} items={humanReview.assumptions} />
            <List title={text.openQuestions} items={humanReview.openQuestions} />
            <List title={text.verify} items={humanReview.pmVerification} />
          </section>
          <div className="mt-6"><ButtonLink href={`/prd/${opportunity.id}`}>{text.generatePrd}</ButtonLink></div>
        </section>
        <aside className="rounded border border-ink/10 bg-white p-6 shadow-soft">
          <h2 className="text-xl font-bold">{text.riceScore}</h2><p className="mt-2 text-sm leading-6 text-ink/65">{text.riceHelp}</p>
          <div className="mt-5 grid grid-cols-2 gap-3"><Score label={text.reach} value={opportunity.rice.reach.toLocaleString()} /><Score label={text.impact} value={`${opportunity.rice.impact} / 3`} /><Score label={text.confidence} value={`${opportunity.rice.confidence}%`} /><Score label={text.effort} value={`${opportunity.rice.effort} ${text.weeks}`} /></div>
          <div className="mt-4 rounded bg-ink p-5 text-white"><p className="text-sm text-white/70">{text.finalScore}</p><p className="mt-1 text-4xl font-bold">{opportunity.rice.score}</p></div>
          <h3 className="mt-6 font-bold">{text.evidenceQuotes}</h3><div className="mt-3 space-y-3">{cluster.evidence.map((quote) => <blockquote key={quote} className="rounded border-l-4 border-gold bg-field p-4 text-sm leading-6 text-ink/70">&quot;{quote}&quot;</blockquote>)}</div>
        </aside>
      </div>
    </AppShell>
  );
}

export function MockPrdView({ id }: { id: string }) {
  const { language } = useLanguage();
  const text = copy[language];
  const { opportunities } = getMockData(language);
  const opportunity = opportunities.find((item) => item.id === id) ?? opportunities[0];
  const prd = opportunity.prdDraft;
  const experiment = opportunity.experimentPlan;

  return (
    <AppShell>
      <SectionHeader eyebrow={text.step4} title={`${prd.title} PRD`} description={text.prdDescription} />
      <div className="mb-6 rounded border border-ink/10 bg-white p-5 shadow-soft"><p className="text-sm font-semibold uppercase tracking-wide text-clay">{text.selected}</p><p className="mt-2 text-lg font-bold">{opportunity.title}</p><p className="mt-2 text-sm leading-6 text-ink/65">{text.flow}</p></div>
      <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <section className="rounded border border-ink/10 bg-white p-6 shadow-soft"><p className="text-sm font-semibold uppercase tracking-wide text-clay">{text.prdDraft}</p><h2 className="mt-2 text-2xl font-bold">{prd.title}</h2><p className="mt-4 leading-7 text-ink/75">{prd.objective}</p><Info label={text.problemStatement} value={prd.problemStatement} /><Info label={text.targetUser} value={prd.targetUser} /><List title={text.userStories} items={prd.userStories} /><List title={text.mvpScope} items={prd.mvpScope} /><List title={text.successMetrics} items={prd.successMetrics} /><List title={text.nonGoals} items={prd.nonGoals} /><List title={text.edgeCases} items={prd.edgeCases} /><List title={text.openQuestions} items={prd.openQuestions} /></section>
        <aside className="rounded border border-ink/10 bg-white p-6 shadow-soft"><p className="text-sm font-semibold uppercase tracking-wide text-clay">{text.experimentPlan}</p><h2 className="mt-2 text-2xl font-bold">{text.testOutline}</h2><Info label={text.hypothesis} value={experiment.hypothesis} /><Info label={text.audience} value={experiment.audience} /><Info label={text.duration} value={experiment.duration} /><List title={text.variants} items={experiment.variants} /><List title={text.guardrails} items={experiment.guardrails} /><div className="mt-6"><ButtonLink href={`/evaluation/${opportunity.id}`}>{text.evaluate}</ButtonLink></div></aside>
      </div>
    </AppShell>
  );
}

export function MockEvaluationView({ id }: { id: string }) {
  const { language } = useLanguage();
  const text = copy[language];
  const { opportunities } = getMockData(language);
  const opportunity = opportunities.find((item) => item.id === id) ?? opportunities[0];
  const evaluation = opportunity.evaluation;

  return (
    <AppShell>
      <SectionHeader eyebrow={text.step5} title={text.evaluationTitle} description={text.evaluationDescription} />
      <section className="mb-6 rounded border border-ink/10 bg-white p-6 shadow-soft"><p className="text-sm font-semibold uppercase tracking-wide text-clay">{text.selected}</p><h2 className="mt-2 text-xl font-bold">{opportunity.title}</h2><p className="mt-2 text-sm leading-6 text-ink/65">{text.flow}</p><div className="mt-5 grid gap-3 md:grid-cols-3">{evaluation.aiReview.map((item) => <article key={item.name} className="rounded border border-ink/10 bg-field p-4"><p className="text-sm font-semibold text-ink/60">{item.name}</p><p className="mt-2 text-2xl font-bold text-ink">{item.value}</p><p className="mt-2 text-sm leading-6 text-ink/70">{item.detail}</p></article>)}</div></section>
      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <section className="rounded border border-ink/10 bg-white p-6 shadow-soft"><h2 className="text-xl font-bold">{text.riskFlags}</h2><div className="mt-5 space-y-4">{opportunity.risks.map((risk) => <article key={risk.label} className="rounded border border-ink/10 p-5"><div className="flex items-center justify-between gap-3"><h3 className="font-bold">{risk.label}</h3><span className="rounded bg-clay/10 px-3 py-1 text-sm font-semibold text-clay">{getLocalizedLevel(language, risk.level)}</span></div><p className="mt-3 text-sm leading-6 text-ink/70">{risk.detail}</p></article>)}</div></section>
        <section className="rounded border border-ink/10 bg-white p-6 shadow-soft"><h2 className="text-xl font-bold">{text.evaluationMetrics}</h2><div className="mt-5 overflow-x-auto rounded border border-ink/10"><table className="w-full min-w-[680px] border-collapse text-left text-sm"><thead className="bg-ink text-white"><tr><th className="px-4 py-3">{text.metric}</th><th className="px-4 py-3">{text.baseline}</th><th className="px-4 py-3">{text.target}</th><th className="px-4 py-3">{text.owner}</th></tr></thead><tbody>{evaluation.metrics.map((metric) => <tr key={metric.name} className="border-t border-ink/10 bg-white"><td className="px-4 py-4 font-semibold">{metric.name}</td><td className="px-4 py-4 text-ink/70">{metric.baseline}</td><td className="px-4 py-4 text-ink/70">{metric.target}</td><td className="px-4 py-4 text-ink/70">{metric.owner}</td></tr>)}</tbody></table></div><div className="mt-6 rounded bg-moss p-5 text-white"><p className="text-sm font-semibold uppercase tracking-wide text-white/70">{text.recommendation}</p><p className="mt-2 text-xl font-bold">{evaluation.recommendation}</p><p className="mt-2 text-sm leading-6 text-white/80">{evaluation.recommendationDetail}</p></div><div className="mt-6 flex flex-wrap gap-3"><ButtonLink href="/dashboard" variant="secondary">{text.backDashboard}</ButtonLink><ButtonLink href={`/prd/${opportunity.id}`}>{text.reviewPrd}</ButtonLink></div></section>
      </div>
    </AppShell>
  );
}

function Info({ label, value }: { label: string; value: string }) { return <div className="mt-4 rounded bg-field p-4"><p className="text-sm font-semibold text-ink/60">{label}</p><p className="mt-2 text-sm leading-7 text-ink/75">{value}</p></div>; }
function Score({ label, value }: { label: string; value: string }) { return <div className="rounded bg-field p-4"><p className="text-sm text-ink/60">{label}</p><p className="mt-1 text-xl font-bold">{value}</p></div>; }
function List({ title, items }: { title: string; items: string[] }) { return <div className="mt-5"><h3 className="font-bold">{title}</h3><ul className="mt-3 space-y-2">{items.map((item) => <li key={item} className="rounded bg-field px-4 py-3 text-sm leading-6 text-ink/75">{item}</li>)}</ul></div>; }
