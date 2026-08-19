'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import SkillGapChart from '../../components/SkillGapChart';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorBoundary from '../../components/ErrorBoundary';
import { Target, Sparkles, BookOpen, UserCheck, ArrowRight } from 'lucide-react';

function SkillAnalysisContent() {
  const searchParams = useSearchParams();
  const initialCandidate = searchParams.get('candidate') || '';

  const [candidates, setCandidates] = useState([]);
  const [roles, setRoles] = useState([]);
  
  const [selectedCandidate, setSelectedCandidate] = useState(initialCandidate || '');
  const [selectedRole, setSelectedRole] = useState('');
  
  const [analysisData, setAnalysisData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch('/api/candidates').then(r => r.json()),
      fetch('/api/roles').then(r => r.json())
    ]).then(([candList, roleList]) => {
      if (Array.isArray(candList)) {
        setCandidates(candList);
        if (!selectedCandidate && candList.length > 0) {
          setSelectedCandidate(candList[0].id);
        }
      }
      if (Array.isArray(roleList)) {
        setRoles(roleList);
        if (roleList.length > 2) {
          setSelectedRole(roleList[2].id);
        }
      }
    }).catch(err => console.error('Failed to load initial analysis options:', err));
  }, []);

  const handleAnalyze = async (candId = selectedCandidate, roleId = selectedRole) => {
    if (!candId || !roleId) return;
    
    setLoading(true);
    setHasSearched(true);
    
    try {
      const res = await fetch(`/api/analytics?type=skill-gap&candidateId=${encodeURIComponent(candId)}&roleId=${encodeURIComponent(roleId)}`);
      const data = await res.json();
      setAnalysisData(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to run skill gap analysis:', err);
    } finally {
      setLoading(false);
    }
  };

  const selectedCandObj = candidates.find(c => c.id === selectedCandidate);
  const selectedRoleObj = roles.find(r => r.id === selectedRole);
  const missingSkills = analysisData.filter(s => !s.hasSkill);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Target className="w-6 h-6 text-indigo-400" />
            Skill Gap & Role Readiness Analyzer
          </h1>
          <p className="text-xs text-slate-400">
            Computes candidate capability intersection against role graph requirements <code className="text-indigo-300 font-mono">{"(Role)-[:REQUIRES]->(Skill)"}</code>
          </p>
        </div>
      </div>

      {/* Selectors Card */}
      <div className="card p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div className="md:col-span-2 space-y-1.5">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Target Candidate
            </label>
            <select 
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-slate-200 text-sm"
              value={selectedCandidate}
              onChange={(e) => setSelectedCandidate(e.target.value)}
            >
              <option value="">Select candidate profile...</option>
              {candidates.map(c => (
                <option key={c.id} value={c.id}>{c.name} — {c.title}</option>
              ))}
            </select>
          </div>
          
          <div className="md:col-span-2 space-y-1.5">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Target Role Benchmark
            </label>
            <select 
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-slate-200 text-sm"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="">Select target role...</option>
              {roles.map(r => (
                <option key={r.id} value={r.id}>{r.name} ({r.department})</option>
              ))}
            </select>
          </div>
          
          <div className="md:col-span-1">
            <button 
              className="btn-primary w-full h-[42px] text-xs"
              onClick={() => handleAnalyze(selectedCandidate, selectedRole)}
              disabled={!selectedCandidate || !selectedRole || loading}
            >
              <span>Analyze Gaps</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Analysis Results Display */}
      <div className="mt-4">
        {loading ? (
          <LoadingSpinner message="Evaluating role requirements against candidate graph skills..." />
        ) : (
          hasSearched && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <SkillGapChart skills={analysisData} />
              </div>
              
              {/* Recommendations & Upskilling Column */}
              <div className="lg:col-span-1 space-y-6">
                <div className="card p-5 space-y-4">
                  <h3 className="font-bold text-sm text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                    <Sparkles size={16} className="text-amber-400" /> Graph Upskilling Roadmap
                  </h3>
                  
                  {missingSkills.length > 0 ? (
                    <>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        To qualify for <span className="text-indigo-400 font-semibold">{selectedRoleObj?.name || 'the role'}</span>, {selectedCandObj?.name || 'this candidate'} should bridge these key prerequisites:
                      </p>
                      
                      <div className="space-y-2">
                        {missingSkills.map((gap, gIdx) => (
                          <div key={gIdx} className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-bold text-xs text-white">{gap.skillName}</h4>
                              <span className="text-[10px] text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20">
                                Required
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400">Recommended action: Complete verified certification or contribute to open-source repo utilizing {gap.skillName}.</p>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center space-y-2">
                      <UserCheck className="w-8 h-8 text-emerald-400 mx-auto" />
                      <h4 className="text-sm font-bold text-emerald-300">100% Graph Skill Match!</h4>
                      <p className="text-xs text-slate-300">Candidate possesses all prerequisite capabilities required by this role specification.</p>
                    </div>
                  )}
                </div>

                <div className="card p-5 bg-indigo-950/20 border-indigo-500/20 space-y-2 text-xs">
                  <h4 className="font-bold text-indigo-300 flex items-center gap-1.5">
                    <BookOpen size={14} /> Knowledge Graph Insights
                  </h4>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    Graph gap analysis utilizes node degrees and edge properties rather than fuzzy text matching, ensuring deterministic prerequisite validation.
                  </p>
                </div>
              </div>
            </div>
          )
        )}
        
        {!hasSearched && !loading && (
          <div className="text-center p-12 text-slate-400 bg-slate-900/60 rounded-2xl border border-dashed border-slate-800">
            <Target className="w-10 h-10 text-slate-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white mb-1">Select a Candidate and Target Role</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Identify exact competency matches and missing graph skill requirements in real time.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SkillAnalysisPage() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner message="Loading Skill Gap Analyzer..." />}>
        <SkillAnalysisContent />
      </Suspense>
    </ErrorBoundary>
  );
}
