export default function EmptyState({ title, description, icon: Icon, action }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-slate-900/60 rounded-2xl border border-dashed border-slate-800">
      {Icon && (
        <div className="w-14 h-14 bg-slate-800/80 rounded-2xl flex items-center justify-center mb-4 text-slate-400 border border-slate-700/50">
          <Icon size={28} />
        </div>
      )}
      <h3 className="text-base font-bold text-white mb-1">{title}</h3>
      <p className="text-sm text-slate-400 mb-5 max-w-sm">{description}</p>
      
      {action && (
        <button 
          onClick={action.onClick}
          className="btn-primary text-sm py-2 px-4"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
