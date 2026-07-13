export default function StatCard({ icon, label, value, unit, children, className = '' }) {
  return (
    <div
      className={`rounded-3xl bg-white/85 dark:bg-white/[0.06] backdrop-blur-xl border border-black/[0.08] dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.08)] p-5 ${className}`}
    >
      <div className="flex items-center gap-2 text-xs font-medium text-muted mb-3">
        <span className="text-primary">{icon}</span>
        {label}
      </div>
      <div className="flex items-baseline gap-1 text-ink dark:text-white">
        <span className="text-2xl font-semibold">{value}</span>
        {unit && <span className="text-xs text-muted">{unit}</span>}
      </div>
      {children}
    </div>
  );
}