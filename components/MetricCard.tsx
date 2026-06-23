export function MetricCard({ label, value, helper }: { label: string; value: string; helper: string }) {
  return (
    <div className="rounded border border-ink/10 bg-white p-5 shadow-soft">
      <p className="text-sm text-ink/60">{label}</p>
      <p className="mt-2 text-3xl font-bold text-ink">{value}</p>
      <p className="mt-2 text-sm leading-6 text-ink/65">{helper}</p>
    </div>
  );
}
