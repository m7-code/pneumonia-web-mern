export default function StatCard({ icon, label, value, unit, children, className = '', tint = 'neutral' }) {
  return (
    <div className={`glass-card tint-${tint} rounded-3xl p-5 ${className}`}>
      <div className="relative z-[2] flex items-center gap-2 text-xs font-medium text-muted mb-3">
        <span className="text-primary">{icon}</span>
        {label}
      </div>
      <div className="relative z-[2] flex items-baseline gap-1 text-ink dark:text-white">
        <span className="text-2xl font-semibold">{value}</span>
        {unit && <span className="text-xs text-muted">{unit}</span>}
      </div>
      <div className="relative z-[2]">{children}</div>
    </div>
  );
}