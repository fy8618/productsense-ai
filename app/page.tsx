"use client";

import { AppShell } from "@/components/AppShell";
import { ButtonLink } from "@/components/ButtonLink";
import { useLanguage } from "@/components/LanguageProvider";
import { getLocalizedLevel, getMockData } from "@/lib/mockData";

export default function Home() {
  const { language, t } = useLanguage();
  const { feedbackSources, opportunities, painClusters } = getMockData(language);

  return (
    <AppShell>
      <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-clay">{t("home.eyebrow")}</p>
          <h1 className="max-w-3xl text-4xl font-bold leading-tight text-ink sm:text-5xl">{t("home.title")}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-ink/70">{t("home.subtitle")}</p>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-ink/70">{t("home.features")}</p>
          <p className="mt-4 max-w-2xl rounded border border-clay/20 bg-clay/10 p-4 text-sm font-semibold leading-6 text-ink/70">{t("home.disclaimer")}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/upload">{t("home.startMock")}</ButtonLink>
            <ButtonLink href="/ai-analysis" variant="secondary">{t("home.startAi")}</ButtonLink>
          </div>
        </div>

        <div className="rounded border border-ink/10 bg-white p-5 shadow-soft">
          <div className="mb-5 flex items-center justify-between border-b border-ink/10 pb-4">
            <div><p className="text-sm text-ink/60">{t("home.workspace")}</p><h2 className="text-xl font-bold">{t("home.opportunity")}</h2></div>
            <span className="rounded bg-gold/25 px-3 py-1 text-sm font-semibold text-ink">{t("home.mockData")}</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <MiniStat label={t("home.painClusters")} value={String(painClusters.length)} />
            <MiniStat label={t("home.opportunities")} value={String(opportunities.length)} />
            <MiniStat label={t("home.sources")} value={String(feedbackSources.length)} />
          </div>
          <div className="mt-5 space-y-3">
            {painClusters.map((cluster) => (
              <div key={cluster.id} className="rounded border border-ink/10 p-4">
                <div className="flex items-start justify-between gap-3"><p className="font-semibold">{cluster.name}</p><span className="rounded bg-tide/10 px-2 py-1 text-xs font-semibold text-tide">{getLocalizedLevel(language, cluster.severity)}</span></div>
                <p className="mt-2 text-sm leading-6 text-ink/65">{cluster.summary}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </AppShell>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return <div className="rounded bg-field p-4"><p className="text-sm text-ink/60">{label}</p><p className="mt-2 text-2xl font-bold">{value}</p></div>;
}
