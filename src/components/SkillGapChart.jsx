'use client';

import EmptyState from './EmptyState';
import { Target, CheckCircle, XCircle } from 'lucide-react';

export default function SkillGapChart({ skills = [] }) {
  if (!skills || skills.length === 0) {
    return (
      <EmptyState 
        title="No Skill Comparison Data" 
        description="Select a candidate and target role to compute graph-based skill overlaps and gaps."
        icon={Target}
      />
    );
  }

  const matchedSkills = skills.filter(s => s.hasSkill).length;
  const matchPercentage = Math.round((matchedSkills / skills.length) * 100) || 0;

  return (
    <div className="card w-full space-y-6">
      {/* Match Score Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-850 border border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-400" />
            Skill Match & Qualification Analysis
          </h3>
          <p className="text-xs text-slate-400 mt-1">Comparing candidate capabilities against target role graph prerequisites</p>
        </div>
        <div className="flex items-center gap-4 bg-slate-900/90 px-4 py-3 rounded-xl border border-slate-800">
          <div>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Match Score</span>
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl font-extrabold ${matchPercentage >= 70 ? 'text-emerald-400' : matchPercentage >= 40 ? 'text-amber-400' : 'text-rose-400'}`}>
                {matchPercentage}%
              </span>
              <span className="text-xs text-slate-400 font-medium">({matchedSkills}/{skills.length} skills)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Skills Matrix Breakdown */}
      <div className="space-y-3.5">
        {skills.map((skill, idx) => {
          const isMatch = skill.hasSkill;
          const importance = skill.importance || 'High';
          const prof = skill.currentProficiency || 0;

          return (
            <div key={idx} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="font-semibold text-sm text-slate-200">{skill.skillName || skill.name}</span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${
                    importance === 'High' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 
                    importance === 'Low' ? 'bg-slate-800 text-slate-400 border-slate-700' : 
                    'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}>
                    {importance} Priority
                  </span>
                </div>
                <div>
                  {isMatch ? (
                    <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                      <CheckCircle size={13} /> Verified (Level {prof}/5)
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-rose-400 flex items-center gap-1.5 bg-rose-500/10 px-2.5 py-1 rounded-lg border border-rose-500/20">
                      <XCircle size={13} /> Missing Prerequisite
                    </span>
                  )}
                </div>
              </div>

              {/* Level Progress Bar */}
              <div className="relative h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-700 ${isMatch ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' : 'bg-transparent'}`}
                  style={{ width: isMatch ? `${Math.min(100, Math.max(20, prof * 20))}%` : '0%' }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between text-xs text-slate-400 bg-slate-950 p-3 rounded-xl border border-slate-850">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-400"></div> Matched In Graph</div>
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-rose-400"></div> Gap To Bridge</div>
        </div>
        <span className="text-slate-500 text-[11px]">Level scale: 1 (Novice) to 5 (Mastery)</span>
      </div>
    </div>
  );
}
