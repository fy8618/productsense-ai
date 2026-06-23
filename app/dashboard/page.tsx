"use client";

import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { useLanguage } from "@/components/LanguageProvider";
import { MetricCard } from "@/components/MetricCard";
import { SectionHeader } from "@/components/SectionHeader";
import { getLocalizedLevel, getMockData } from "@/lib/mockData";

export default function DashboardPage() {
  const { language, t } = useLanguage();
  const { opportunities, painClusters } = getMockData(language);
  const workflowSteps = [t("dashboard.raw"), t("dashboard.clusters"), t("dashboard.evidence"), t("dashboard.opportunities")];

  return (
    <AppShell>
      <SectionHeader eyebrow={t("dashboard.eyebrow")} title={t("dashboard.title")} description={t("dashboard.description")} />
      <section className="mb-6 rounded border border-ink/10 bg-white p-5 shadow-soft">
        <h2 className="text-lg font-bold">{t("dashboard.workflow")}</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-4">{workflowSteps.map((step) => <div key={step} className="rounded bg-field p-4 text-sm font-semibold text-ink/75">{step}</div>)}</div>
        <p className="mt-3 text-sm leading-6 text-ink/65">{t("dashboard.mockHelp")}</p>
      </section>
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard label={t("dashboard.feedbackItems")} value="283" helper={t("dashboard.itemsHelp")} />
        <MetricCard label={t("dashboard.topCluster")} value="86" helper={t("dashboard.clusterMetricHelp")} />
        <MetricCard label={t("dashboard.topRice")} value="443" helper={t("dashboard.riceMetricHelp")} />
      </div>
      <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.95fr]">
        <div className="rounded border border-ink/10 bg-white p-6 shadow-soft">
          <h2 className="text-xl font-bold">{t("dashboard.clusterTitle")}</h2><p className="mt-2 text-sm leading-6 text-ink/65">{t("dashboard.clusterHelp")}</p>
          <div className="mt-5 space-y-4">{painClusters.map((cluster) => <article key={cluster.id} className="rounded border border-ink/10 p-5"><div className="flex flex-wrap items-center justify-between gap-3"><h3 className="text-lg font-bold">{cluster.name}</h3><span className="rounded bg-clay/10 px-3 py-1 text-sm font-semibold text-clay">{getLocalizedLevel(language, cluster.severity)}</span></div><p className="mt-2 text-sm text-ink/60">{cluster.mentions} {t("dashboard.mentions")} · {cluster.trend}</p><p className="mt-3 leading-7 text-ink/70">{cluster.summary}</p><div className="mt-4 flex flex-wrap gap-2">{cluster.segments.map((segment) => <span key={segment} className="rounded bg-field px-3 py-1 text-sm text-ink/70">{segment}</span>)}</div><blockquote className="mt-4 border-l-4 border-gold pl-4 text-sm leading-6 text-ink/70">&quot;{cluster.evidence[0]}&quot;</blockquote></article>)}</div>
        </div>
        <div className="rounded border border-ink/10 bg-white p-6 shadow-soft">
          <h2 className="text-xl font-bold">{t("dashboard.opportunities")}</h2><p className="mt-2 text-sm leading-6 text-ink/65">{t("dashboard.opportunityHelp")}</p>
          <div className="mt-5 space-y-4">{opportunities.map((opportunity) => { const cluster = painClusters.find((item) => item.id === opportunity.painPointId); return <Link key={opportunity.id} href={`/opportunities/${opportunity.id}`} className="block rounded border border-ink/10 p-5 transition hover:border-moss hover:bg-field"><div className="flex items-start justify-between gap-4"><h3 className="font-bold">{opportunity.title}</h3><span className="rounded bg-moss px-3 py-1 text-sm font-bold text-white">{opportunity.rice.score}</span></div><p className="mt-2 text-xs font-semibold uppercase tracking-wide text-clay">{t("dashboard.painPointLabel")} {cluster?.name}</p><p className="mt-3 text-sm leading-6 text-ink/70">{opportunity.problem}</p><p className="mt-3 text-sm font-semibold text-tide">{opportunity.evidenceSummary}</p>{cluster && <blockquote className="mt-3 border-l-4 border-gold pl-4 text-sm leading-6 text-ink/65">&quot;{cluster.evidence[0]}&quot;</blockquote>}</Link>; })}</div>
        </div>
      </section>
    </AppShell>
  );
}
