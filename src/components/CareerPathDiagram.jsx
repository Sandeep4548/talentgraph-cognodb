'use client';

import EmptyState from './EmptyState';
import { ArrowRight, Map, CheckCircle2, Sparkles } from 'lucide-react';

export default function CareerPathDiagram({ path = [], length = 0 }) {
  if (!path || path.length === 0) {
    return (
      <EmptyState 
        title="No Career Path Found" 
        description="Select a starting role and target role to discover optimal openCypher shortest paths."
        icon={Map}
      />
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Path Summary Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Optimal Career Progression Ladder</h4>
            <p className="text-xs text-indigo-300/80">Calculated via CognoDB <code className="text-indigo-200 bg-indigo-950/60 px-1.5 py-0.5 rounded font-mono">shortestPath()</code></p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 self-start sm:self-auto">
          <span>{path.length} Total Milestones</span>
          <span>•</span>
          <span className="text-indigo-400">{length} Graph Hops</span>
        </div>
      </div>

      {/* Steps Flow */}
      <div className="w-full overflow-x-auto py-6 px-2">
        <div className="flex flex-col lg:flex-row items-stretch justify-start min-w-max gap-4 lg:gap-6 mx-auto">
          {path.map((role, index) => {
            const isStart = index === 0;
            const isTarget = index === path.length - 1;
            const requiredSkills = role.requiredSkills || [];

            return (
              <div key={`${role.name || role.id}-${index}`} className="flex flex-col lg:flex-row items-center gap-4 lg:gap-6">
                {/* Role Card */}
                <div className={`
                  card w-72 p-5 relative flex flex-col justify-between transition-all duration-300
                  ${isStart ? 'border-indigo-500/50 bg-indigo-950/30 ring-1 ring-indigo-500/30' : ''}
                  ${isTarget ? 'border-emerald-500/50 bg-emerald-950/30 ring-1 ring-emerald-500/30' : ''}
                  ${!isStart && !isTarget ? 'bg-slate-900/90' : ''}
                `}>
                  {/* Badge */}
                  {isStart && (
                    <div className="absolute -top-3 left-4 bg-indigo-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-md">
                      Current Level
                    </div>
                  )}
                  {isTarget && (
                    <div className="absolute -top-3 left-4 bg-emerald-500 text-slate-950 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-md">
                      Target Milestone
                    </div>
                  )}
                  {!isStart && !isTarget && (
                    <div className="absolute -top-3 left-4 bg-slate-800 text-slate-400 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border border-slate-700">
                      Step {index + 1}
                    </div>
                  )}
                  
                  <div className="pt-2 mb-3">
                    <h4 className="font-bold text-white text-base mb-1">{role.name}</h4>
                    <p className="text-xs text-slate-400">{role.department || 'Engineering Department'}</p>
                  </div>
                  
                  {requiredSkills.length > 0 && (
                    <div className="pt-3 border-t border-slate-800 text-left">
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-2 font-semibold flex items-center gap-1">
                        <CheckCircle2 size={12} className="text-indigo-400" /> Prerequisite Skills
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {requiredSkills.slice(0, 4).map((skill, sIdx) => (
                          <span key={sIdx} className="bg-slate-800/80 text-slate-300 text-[11px] px-2 py-0.5 rounded-md border border-slate-700/60">
                            {typeof skill === 'string' ? skill : skill.name}
                          </span>
                        ))}
                        {requiredSkills.length > 4 && (
                          <span className="text-slate-400 text-[10px] px-1.5 py-0.5 self-center font-medium">
                            +{requiredSkills.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Arrow Connector */}
                {index < path.length - 1 && (
                  <div className="flex items-center justify-center text-indigo-400 lg:rotate-0 rotate-90 my-2 lg:my-0">
                    <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center shadow-lg">
                      <ArrowRight size={16} />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
