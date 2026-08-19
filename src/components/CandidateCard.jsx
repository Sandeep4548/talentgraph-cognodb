import Link from 'next/link';
import { MapPin, Briefcase, ChevronRight } from 'lucide-react';
import SkillBadge from './SkillBadge';

export default function CandidateCard({ candidate }) {
  const { id, name, title, experience, location, skills = [] } = candidate;
  
  // Avatar initials
  const initials = name
    ? name
        .split(' ')
        .map(n => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    : 'ID';

  const maxSkills = 4;
  const displaySkills = Array.isArray(skills) ? skills.slice(0, maxSkills) : [];
  const remainingSkills = Array.isArray(skills) ? Math.max(0, skills.length - maxSkills) : 0;

  return (
    <Link href={`/candidates/${id}`} className="group block h-full">
      <div className="card h-full flex flex-col hover:border-indigo-500/50 hover:bg-slate-850/80 transition-all duration-200">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 text-indigo-300 flex items-center justify-center font-bold text-base flex-shrink-0 group-hover:scale-105 transition-transform">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors truncate">
              {name}
            </h3>
            <p className="text-xs font-medium text-slate-400 truncate">{title}</p>
          </div>
        </div>

        <div className="space-y-2 mb-5 text-xs text-slate-400 flex-1">
          <div className="flex items-center gap-2">
            <Briefcase size={14} className="text-slate-500 shrink-0" />
            <span className="truncate">{experience || 3}+ years experience</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-slate-500 shrink-0" />
            <span className="truncate">{location || 'Remote'}</span>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-800/80">
          <div className="flex flex-wrap gap-1.5 mb-3">
            {displaySkills.map((skill, index) => (
              <SkillBadge 
                key={index} 
                name={typeof skill === 'string' ? skill : skill.name} 
                proficiency={skill.proficiency} 
                size="sm"
              />
            ))}
            {remainingSkills > 0 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-slate-800 text-slate-400 text-[11px] font-medium">
                +{remainingSkills}
              </span>
            )}
            {displaySkills.length === 0 && (
              <span className="text-xs text-slate-500 italic">No skills tagged</span>
            )}
          </div>

          <div className="flex items-center justify-between text-xs font-medium text-indigo-400 group-hover:text-indigo-300 pt-1">
            <span>View Graph Profile</span>
            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
}
