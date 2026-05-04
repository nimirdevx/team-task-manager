export default function StatsCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="ui-panel p-5">
      <p className="text-caption uppercase tracking-wide text-ink-tertiary">{label}</p>
      <p className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink">{value}</p>
    </div>
  );
}
