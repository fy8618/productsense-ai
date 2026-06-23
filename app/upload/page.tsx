"use client";

import { AppShell } from "@/components/AppShell";
import { ButtonLink } from "@/components/ButtonLink";
import { useLanguage } from "@/components/LanguageProvider";
import { SectionHeader } from "@/components/SectionHeader";
import { getMockData } from "@/lib/mockData";

export default function UploadPage() {
  const { language, t } = useLanguage();
  const { feedbackSources, rawFeedbackPreview } = getMockData(language);

  return (
    <AppShell>
      <SectionHeader eyebrow={t("upload.eyebrow")} title={t("upload.title")} description={t("upload.description")} />
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded border border-ink/10 bg-white p-6 shadow-soft">
          <h2 className="text-xl font-bold">{t("upload.intake")}</h2>
          <div className="mt-5 rounded border-2 border-dashed border-moss/30 bg-field p-8 text-center">
            <p className="text-lg font-semibold">{t("upload.drop")}</p><p className="mt-2 text-sm leading-6 text-ink/65">{t("upload.prototype")}</p>
          </div>
          <label className="mt-5 block text-sm font-semibold" htmlFor="goal">{t("upload.goal")}</label>
          <textarea key={language} id="goal" className="mt-2 min-h-28 w-full rounded border border-ink/15 px-4 py-3" defaultValue={t("upload.defaultGoal")} />
          <div className="mt-6"><ButtonLink href="/dashboard">{t("upload.analyze")}</ButtonLink></div>
        </section>
        <section className="rounded border border-ink/10 bg-white p-6 shadow-soft">
          <h2 className="text-xl font-bold">{t("upload.sources")}</h2>
          <div className="mt-5 space-y-3">{feedbackSources.map((source) => <div key={source} className="rounded bg-field p-4 text-sm font-medium text-ink/75">{source}</div>)}</div>
        </section>
      </div>
      <section className="mt-6 rounded border border-ink/10 bg-white p-6 shadow-soft">
        <div className="max-w-3xl"><h2 className="text-xl font-bold">{t("upload.preview")}</h2><p className="mt-2 text-sm leading-6 text-ink/65">{t("upload.previewHelp")}</p></div>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {rawFeedbackPreview.map((item) => <article key={`${item.source}-${item.quote}`} className="rounded border border-ink/10 bg-field p-4"><div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-wide text-ink/55"><span>{item.source}</span><span>{item.segment}</span></div><p className="mt-3 text-sm leading-6 text-ink/75">&quot;{item.quote}&quot;</p></article>)}
        </div>
      </section>
    </AppShell>
  );
}
