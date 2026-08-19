export default function SkillBadge({ name, proficiency, category, size = 'sm' }) {
  const getColors = () => {
    switch (category?.toLowerCase()) {
      case 'frontend':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'backend':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'database':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'devops':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'ai & data':
      case 'ai':
        return 'bg-pink-500/10 text-pink-400 border-pink-500/30';
      case 'design':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      case 'leadership':
        return 'bg-violet-500/10 text-violet-400 border-violet-500/30';
      default:
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
    }
  };

  const sizes = {
    xs: 'px-2 py-0.5 text-[10px]',
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3.5 py-1.5 text-sm'
  };

  return (
    <div 
      className={`inline-flex items-center gap-1.5 rounded-lg border ${getColors()} ${sizes[size]} font-medium transition-colors cursor-default`}
      title={name}
    >
      <span className="truncate max-w-[160px]">{name}</span>
      {proficiency && (
        <div className="flex gap-0.5 ml-1 pl-1.5 border-l border-current/30">
          {[1, 2, 3, 4, 5].map((level) => (
            <div 
              key={level} 
              className={`w-1.5 h-1.5 rounded-full ${level <= proficiency ? 'bg-current' : 'bg-transparent border border-current/40'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
