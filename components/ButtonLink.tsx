import Link from "next/link";

export function ButtonLink({ href, children, variant = "primary" }: { href: string; children: React.ReactNode; variant?: "primary" | "secondary" }) {
  const className =
    variant === "primary"
      ? "inline-flex items-center justify-center rounded bg-ink px-5 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-moss"
      : "inline-flex items-center justify-center rounded border border-ink/15 bg-white px-5 py-3 text-sm font-semibold text-ink transition hover:border-moss hover:text-moss";

  return <Link href={href} className={className}>{children}</Link>;
}
