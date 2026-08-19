export default function StatsCard({ title, value, icon: Icon, trend, color = 'indigo', subtitle }) {
  const colorStyles = {
    indigo: {
      bg: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
      glow: 'shadow-indigo-500/10'
    },
    emerald: {
      bg: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
      glow: 'shadow-emerald-500/10'
    },
    amber: {
      bg: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
      glow: 'shadow-amber-500/10'
    },
    purple: {
      bg: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
      glow: 'shadow-purple-500/10'
    },
    rose: {
      bg: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
      glow: 'shadow-rose-500/10'
    }
  };

  const style = colorStyles[color] || colorStyles.indigo;

  return (
    <div className="card flex items-start gap-4 p-5">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${style.bg} ${style.glow}`}>
        {Icon && <Icon className="w-6 h-6" />}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{title}</p>
        <div className="flex items-baseline gap-2">
          <h4 className="text-2xl font-extrabold text-white tracking-tight">{value}</h4>
          {trend && (
            <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${trend.isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
              {trend.isPositive ? '+' : '-'}{trend.value}%
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
