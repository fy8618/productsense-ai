"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { ButtonLink } from "@/components/ButtonLink";
import { EvidenceUsed } from "@/components/EvidenceUsed";
import { useLanguage } from "@/components/LanguageProvider";
import { SectionHeader } from "@/components/SectionHeader";
import { AiAnalysisResult, getDemoAiAnalysisResult, getSampleFeedback } from "@/lib/aiAnalysis";
import { AiResultSource, aiWorkflowStorageKey, saveAiWorkflow } from "@/lib/aiWorkflow";
import { getLocalizedLevel } from "@/lib/mockData";

export default function AiAnalysisPage() {
  const router = useRouter();
  const { language, t } = useLanguage();
  const [feedback, setFeedback] = useState("");
  const [result, setResult] = useState<AiAnalysisResult | null>(null);
  const [resultSource, setResultSource] = useState<AiResultSource>("live");
  const [selectedOpportunityId, setSelectedOpportunityId] = useState("");
  const [error, setError] = useState("");
  const [canUseDemo, setCanUseDemo] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setResult(null);
    setSelectedOpportunityId("");
    setError("");
    setCanUseDemo(false);
  }, [language]);

  async function analyzeFeedback() {
    if (!feedback.trim()) {
      setError(t("aiAnalysis.emptyError"));
      return;
    }

    setIsLoading(true);
    setError("");
    setResult(null);
    setSelectedOpportunityId("");
    setCanUseDemo(false);

    try {
      const response = await fetch("/api/analyze-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feedback, language })
      });
      const data = await response.json();

      if (!response.ok) {
        setCanUseDemo(data.errorType === "quota_or_billing");
        throw new Error(data.error ?? "AI analysis failed.");
      }

      setResult(data);
      setResultSource("live");
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }

  function useDemoResult() {
    setResult(getDemoAiAnalysisResult(language));
    setResultSource("demo");
    setSelectedOpportunityId("");
    setError("");
    setCanUseDemo(false);
  }

  function selectOpportunity(opportunityId: string) {
    if (!result) return;

    saveAiWorkflow(result, opportunityId, resultSource, language);
    setSelectedOpportunityId(opportunityId);
  }

  function approveForPrd() {
    if (!result || !selectedOpportunityId) return;

    saveAiWorkflow(result, selectedOpportunityId, resultSource, language);
    router.push("/ai-prd");
  }

  function backToEdit() {
    localStorage.removeItem(aiWorkflowStorageKey);
    setResult(null);
    setSelectedOpportunityId("");
    setError("");
    setCanUseDemo(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <AppShell>
      <SectionHeader
        eyebrow={t("aiAnalysis.eyebrow")}
        title={t("aiAnalysis.title")}
        description={t("aiAnalysis.description")}
      />

      <section className="rounded border border-ink/10 bg-white p-6 shadow-soft">
        <div className="rounded border border-clay/20 bg-clay/10 p-4 text-sm leading-6 text-ink/75">
          {t("aiAnalysis.warning")}
        </div>

        <label className="mt-6 block text-sm font-semibold" htmlFor="feedback">
          {t("aiAnalysis.feedback")}
        </label>
        <textarea
          id="feedback"
          value={feedback}
          onChange={(event) => setFeedback(event.target.value)}
          className="mt-2 min-h-64 w-full rounded border border-ink/15 px-4 py-3 text-sm leading-6"
          placeholder={t("aiAnalysis.placeholder")}
        />

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setFeedback(getSampleFeedback(language))}
            className="inline-flex items-center justify-center rounded border border-ink/15 bg-white px-5 py-3 text-sm font-semibold text-ink transition hover:border-moss hover:text-moss"
          >
            {t("aiAnalysis.sample")}
          </button>
          <button
            type="button"
            onClick={analyzeFeedback}
            disabled={isLoading}
            className="inline-flex items-center justify-center rounded bg-ink px-5 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-moss disabled:cursor-not-allowed disabled:bg-ink/45"
          >
            {isLoading ? t("aiAnalysis.analyzing") : t("aiAnalysis.analyze")}
          </button>
          {!canUseDemo && (
            <button
              type="button"
              onClick={useDemoResult}
              className="inline-flex items-center justify-center rounded border border-gold/60 bg-gold/10 px-5 py-3 text-sm font-semibold text-ink transition hover:bg-gold/20"
            >
              {t("aiAnalysis.demo")}
            </button>
          )}
          <ButtonLink href="/dashboard" variant="secondary">{t("aiAnalysis.mockDashboard")}</ButtonLink>
        </div>

        {error && (
          <div className="mt-5 rounded border border-clay/30 bg-clay/10 p-4 text-sm leading-6 text-clay">
            <p className="font-semibold">{error}</p>
            {canUseDemo && (
              <>
                <p className="mt-2 text-ink/70">{t("aiAnalysis.providerQuota")}</p>
                <button
                  type="button"
                  onClick={useDemoResult}
                  className="mt-4 inline-flex items-center justify-center rounded bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-moss"
                >
                  {t("aiAnalysis.demo")}
                </button>
              </>
            )}
          </div>
        )}
      </section>

      {isLoading && (
        <section className="mt-6 rounded border border-ink/10 bg-white p-6 shadow-soft">
          <p className="font-semibold">{t("aiAnalysis.loadingTitle")}</p>
          <p className="mt-2 text-sm leading-6 text-ink/65">{t("aiAnalysis.loadingHelp")}</p>
        </section>
      )}

      {result && (
        <AnalysisResult
          result={result}
          source={resultSource}
          selectedOpportunityId={selectedOpportunityId}
          onSelectOpportunity={selectOpportunity}
          onApprove={approveForPrd}
          onBackToEdit={backToEdit}
        />
      )}
    </AppShell>
  );
}

function AnalysisResult({
  result,
  source,
  selectedOpportunityId,
  onSelectOpportunity,
  onApprove,
  onBackToEdit
}: {
  result: AiAnalysisResult;
  source: AiResultSource;
  selectedOpportunityId: string;
  onSelectOpportunity: (opportunityId: string) => void;
  onApprove: () => void;
  onBackToEdit: () => void;
}) {
  const { language, t } = useLanguage();

  return (
    <section className="mt-6 space-y-6">
      <div className="rounded border border-ink/10 bg-white p-6 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-semibold uppercase tracking-wide text-clay">{t("aiAnalysis.structured")}</p>
          <span className={`rounded px-3 py-1 text-sm font-semibold ${source === "demo" ? "bg-gold/20 text-ink" : "bg-moss/15 text-moss"}`}>
            {source === "demo" ? t("aiAnalysis.demoLabel") : t("aiAnalysis.liveLabel")}
          </span>
        </div>
        <h2 className="mt-2 text-2xl font-bold">{t("aiAnalysis.summary")}</h2>
        <p className="mt-3 leading-7 text-ink/75">{result.summary}</p>
        <p className="mt-4 text-sm leading-6 text-ink/60">{t("workflow.label")} {t("workflow.full")}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_0.95fr]">
        <section className="rounded border border-ink/10 bg-white p-6 shadow-soft">
          <h2 className="text-xl font-bold">{t("aiAnalysis.painPoints")}</h2>
          <div className="mt-5 space-y-4">
            {result.painPoints.map((painPoint) => (
              <article key={painPoint.id} className="rounded border border-ink/10 p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="font-bold">{painPoint.title}</h3>
                  <span className="rounded bg-clay/10 px-3 py-1 text-sm font-semibold text-clay">{getLocalizedLevel(language, painPoint.severity)}</span>
                </div>
                <p className="mt-2 text-sm text-ink/60">{painPoint.frequencySignal}</p>
                <p className="mt-3 text-sm leading-6 text-ink/70">{painPoint.description}</p>
                <TagList items={painPoint.userSegments} />
                <QuoteList quotes={painPoint.evidenceQuotes} />
              </article>
            ))}
          </div>
        </section>

        <section className="rounded border border-ink/10 bg-white p-6 shadow-soft">
          <h2 className="text-xl font-bold">{t("aiAnalysis.opportunities")}</h2>
          <div className="mt-5 space-y-4">
            {result.opportunities.map((opportunity) => (
              <article key={opportunity.id} className="rounded border border-ink/10 p-5">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-bold">{opportunity.title}</h3>
                  <span className="rounded bg-moss px-3 py-1 text-sm font-bold text-white">{opportunity.riceScore}</span>
                </div>
                <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-clay">{t("dashboard.painPointLabel")} {opportunity.relatedPainPoint}</p>
                <p className="mt-3 text-sm leading-6 text-ink/70">{opportunity.recommendation}</p>
                <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                  <Score label={t("aiEvaluation.reach")} value={opportunity.reach} />
                  <Score label={t("aiEvaluation.impact")} value={opportunity.impact} />
                  <Score label={t("aiEvaluation.confidence")} value={opportunity.confidence} />
                  <Score label={t("aiEvaluation.effort")} value={opportunity.effort} />
                </div>
                <button
                  type="button"
                  onClick={() => onSelectOpportunity(opportunity.id)}
                  className={`mt-4 inline-flex w-full items-center justify-center rounded px-4 py-3 text-sm font-semibold transition ${
                    selectedOpportunityId === opportunity.id
                      ? "bg-moss text-white"
                      : "border border-ink/15 bg-white text-ink hover:border-moss hover:text-moss"
                  }`}
                >
                  {selectedOpportunityId === opportunity.id ? t("aiAnalysis.selected") : t("aiAnalysis.useOpportunity")}
                </button>
              </article>
            ))}
          </div>
        </section>
      </div>

      <EvidenceUsed
        source={source}
        items={result.painPoints.flatMap((painPoint) => {
          const linkedOpportunity = result.opportunities.find(
            (opportunity) =>
              opportunity.relatedPainPoint === painPoint.id ||
              opportunity.relatedPainPoint.toLowerCase() === painPoint.title.toLowerCase()
          );

          return painPoint.evidenceQuotes.map((quote) => ({
            quote,
            painPoint: painPoint.title,
            opportunity: linkedOpportunity?.title ?? t("aiAnalysis.noLinkedOpportunity")
          }));
        })}
      />

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded border border-ink/10 bg-white p-6 shadow-soft">
          <h2 className="text-xl font-bold">{t("aiAnalysis.risks")}</h2>
          <div className="mt-5 space-y-4">
            {result.risks.map((risk) => (
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
          <p className="text-sm font-semibold uppercase tracking-wide text-clay">{t("aiAnalysis.pmReview")}</p>
          <h2 className="mt-2 text-xl font-bold">{t("aiAnalysis.validationGate")}</h2>
          <div className="mt-4 rounded bg-field p-4">
            <p className="text-sm font-semibold text-ink/60">{t("aiAnalysis.reviewRequired")}</p>
            <p className="mt-2 font-bold">{result.humanReview.required ? (language === "zh" ? "是" : "Yes") : (language === "zh" ? "否" : "No")}</p>
          </div>
          <p className="mt-4 text-sm leading-6 text-ink/70">{result.humanReview.why}</p>
          <List title={t("aiAnalysis.assumptions")} items={result.humanReview.assumptionsToVerify} />
          <List title={t("aiAnalysis.openQuestions")} items={result.humanReview.openQuestions} />
          <div className="mt-5 rounded border border-clay/25 bg-clay/10 p-4 text-sm font-semibold leading-6 text-ink/75">
            {t("aiAnalysis.trustWarning")}
          </div>
          {!selectedOpportunityId && (
            <p className="mt-4 text-sm font-semibold text-clay">{t("aiAnalysis.selectHelp")}</p>
          )}
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onApprove}
              disabled={!selectedOpportunityId}
              className="inline-flex items-center justify-center rounded bg-ink px-5 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-moss disabled:cursor-not-allowed disabled:bg-ink/35"
            >
              {t("aiAnalysis.approve")}
            </button>
            <button
              type="button"
              onClick={onBackToEdit}
              className="inline-flex items-center justify-center rounded border border-ink/15 bg-white px-5 py-3 text-sm font-semibold text-ink transition hover:border-moss hover:text-moss"
            >
              {t("aiAnalysis.backEdit")}
            </button>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <ButtonLink href="/dashboard" variant="secondary">{t("aiAnalysis.mockDashboard")}</ButtonLink>
            <ButtonLink href="/prd/checkout-friction" variant="secondary">{t("aiAnalysis.openMockPrd")}</ButtonLink>
          </div>
        </section>
      </div>
    </section>
  );
}

function TagList({ items }: { items: string[] }) {
  return <div className="mt-4 flex flex-wrap gap-2">{items.map((item) => <span key={item} className="rounded bg-field px-3 py-1 text-sm text-ink/70">{item}</span>)}</div>;
}

function QuoteList({ quotes }: { quotes: string[] }) {
  return <div className="mt-4 space-y-2">{quotes.map((quote) => <blockquote key={quote} className="border-l-4 border-gold pl-4 text-sm leading-6 text-ink/70">"{quote}"</blockquote>)}</div>;
}

function Score({ label, value }: { label: string; value: string }) {
  return <div className="rounded bg-field p-3"><p className="text-xs text-ink/55">{label}</p><p className="mt-1 font-bold text-ink">{value}</p></div>;
}

function List({ title, items }: { title: string; items: string[] }) {
  return <div className="mt-5"><h3 className="font-bold">{title}</h3><ul className="mt-3 space-y-2">{items.map((item) => <li key={item} className="rounded bg-field px-4 py-3 text-sm leading-6 text-ink/75">{item}</li>)}</ul></div>;
}
