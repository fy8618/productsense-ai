"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { EvidenceItem, AiResultSource } from "@/lib/aiWorkflow";

export function EvidenceUsed({ items, source }: { items: EvidenceItem[]; source: AiResultSource }) {
  const { t } = useLanguage();
  const sourceLabel = source === "demo" ? t("evidence.demo") : t("evidence.user");

  return (
    <section className="rounded border border-ink/10 bg-white p-6 shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-xl font-bold">{t("evidence.title")}</h2><span className="rounded bg-gold/20 px-3 py-1 text-sm font-semibold text-ink">{sourceLabel}</span></div>
      {items.length === 0 ? <p className="mt-4 rounded bg-field p-4 text-sm font-semibold text-clay">{t("evidence.none")}</p> : (
        <div className="mt-5 space-y-4">{items.map((item, index) => <article key={`${item.quote}-${index}`} className="rounded border border-ink/10 p-5"><blockquote className="border-l-4 border-gold pl-4 text-sm leading-6 text-ink/75">&quot;{item.quote}&quot;</blockquote><div className="mt-4 grid gap-2 text-sm sm:grid-cols-2"><p className="rounded bg-field px-3 py-2"><span className="font-semibold">{t("evidence.painPoint")}</span> {item.painPoint}</p><p className="rounded bg-field px-3 py-2"><span className="font-semibold">{t("evidence.opportunity")}</span> {item.opportunity}</p></div></article>)}</div>
      )}
    </section>
  );
}
