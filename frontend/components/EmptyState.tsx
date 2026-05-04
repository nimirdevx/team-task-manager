function EmptyGlyph() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden className="text-ink-tertiary">
      <rect x="6" y="10" width="28" height="22" rx="2" stroke="currentColor" strokeWidth="1" opacity="0.9" />
      <path d="M10 18h20M10 24h14" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.55" />
      <circle cx="28" cy="24" r="2" fill="currentColor" opacity="0.35" />
    </svg>
  );
}

export default function EmptyState({
  label = "Empty",
  title,
  description,
  children,
}: {
  label?: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="empty-state flex flex-col items-center justify-center rounded-lg border border-dashed border-hairline-strong/80 bg-surface-1 px-6 py-14 text-center shadow-[inset_0_1px_0_0_rgba(247,248,248,0.04)] md:px-10 md:py-16">
      <div className="empty-state-icon mb-5 flex h-14 w-14 items-center justify-center rounded-md border border-hairline bg-surface-2 text-ink-tertiary">
        <EmptyGlyph />
      </div>
      <p className="font-mono text-caption uppercase tracking-[0.35px] text-ink-tertiary">{label}</p>
      <h3 className="mt-2 max-w-md font-display text-lg font-medium tracking-tight text-ink md:text-xl">{title}</h3>
      {description ? <p className="mt-3 max-w-md text-body-sm leading-relaxed text-ink-subtle">{description}</p> : null}
      {children ? <div className="mt-8 flex flex-wrap items-center justify-center gap-3">{children}</div> : null}
    </div>
  );
}
