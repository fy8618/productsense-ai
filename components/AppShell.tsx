"use client";

import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";

const steps = [
  { labelKey: "nav.upload", href: "/upload" },
  { labelKey: "nav.dashboard", href: "/dashboard" },
  { labelKey: "nav.prioritize", href: "/opportunities/checkout-friction" },
  { labelKey: "nav.draft", href: "/prd" },
  { labelKey: "nav.evaluate", href: "/evaluation" },
  { labelKey: "nav.aiAnalysis", href: "/ai-analysis" },
  { labelKey: "nav.aiPrd", href: "/ai-prd" },
  { labelKey: "nav.aiEvaluation", href: "/ai-evaluation" }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const { language, setLanguage, t } = useLanguage();

  return (
    <main className="min-h-screen px-5 py-6 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-5 border-b border-ink/10 pb-5 md:flex-row md:items-center md:justify-between">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded bg-ink text-sm font-bold text-white">PS</span>
            <span>
              <span className="block text-lg font-bold">ProductSense AI</span>
              <span className="block text-sm text-ink/60">{t("brand.subtitle")}</span>
            </span>
          </Link>
          <nav className="flex flex-wrap items-center gap-2 text-sm text-ink/70">
            {steps.map((step) => (
              <Link key={step.href} href={step.href} className="rounded border border-ink/10 bg-white/70 px-3 py-1">
                {t(step.labelKey)}
              </Link>
            ))}
            <div className="ml-1 inline-flex rounded border border-ink/10 bg-white/70 p-0.5" aria-label={t("language.label")}>
              <button type="button" onClick={() => setLanguage("en")} className={`rounded px-2 py-0.5 text-xs font-semibold ${language === "en" ? "bg-ink text-white" : "text-ink/60"}`}>EN</button>
              <button type="button" onClick={() => setLanguage("zh")} className={`rounded px-2 py-0.5 text-xs font-semibold ${language === "zh" ? "bg-ink text-white" : "text-ink/60"}`}>中文</button>
            </div>
          </nav>
        </header>
        {children}
      </div>
    </main>
  );
}
