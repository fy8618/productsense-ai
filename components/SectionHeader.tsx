export function SectionHeader({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div className="mb-6 max-w-3xl">
      <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-clay">{eyebrow}</p>
      <h1 className="text-3xl font-bold leading-tight text-ink sm:text-4xl">{title}</h1>
      <p className="mt-3 text-base leading-7 text-ink/70">{description}</p>
    </div>
  );
}
