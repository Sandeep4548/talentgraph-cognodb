'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, MapPin, Briefcase, Mail, Calendar, ExternalLink, 
  Users, Sparkles, Target, Share2, Award, FolderGit2
} from 'lucide-react';
import SkillBadge from '../../../components/SkillBadge';
import LoadingSpinner from '../../../components/LoadingSpinner';
import ErrorBoundary from '../../../components/ErrorBoundary';

function CandidateProfileContent() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;
  
  const [candidate, setCandidate] = useState(null);
  const [network, setNetwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [networkTab, setNetworkTab] = useState(1); // 1st degree or 2nd degree

  useEffect(() => {
    const fetchCandidateData = async () => {
      try {
        setLoading(true);
        const [candRes, netRes] = await Promise.all([
          fetch(`/api/candidates/${id}`),
          fetch(`/api/candidates/${id}/network`)
        ]);

        if (candRes.ok) {
          const candData = await candRes.json();
          setCandidate(candData);
        }

        if (netRes.ok) {
          const netData = await netRes.json();
          setNetwork(netData);
        }
      } catch (err) {
        console.error('Failed to load candidate profile', err);
      } finally {
        setLoading(false);
      }
    };
    
    if (id) fetchCandidateData();
  }, [id]);

  if (loading) return <LoadingSpinner message="Querying Candidate Subgraph & Network Neighbors..." />;
  if (!candidate) return <div className="text-center p-12 text-slate-400">Candidate not found in knowledge graph.</div>;

  const initials = candidate.name
    ? candidate.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : 'ID';

  const directNeighbors = network?.nodes?.filter(n => n.distance === 1) || [];
  const secondDegreeNeighbors = network?.nodes?.filter(n => n.distance === 2) || [];

  return (
    <div className="space-y-6">
      {/* Back button & Action shortcuts */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => router.back()}
          className="inline-flex items-center text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={14} className="mr-1.5" /> Back to Directory
        </button>

        <div className="flex items-center gap-2">
          <Link 
            href={`/skill-analysis?candidate=${candidate.id}`}
            className="btn-secondary text-xs py-1.5 px-3"
          >
            <Target size={14} /> Compare Skill Gap
          </Link>
        </div>
      </div>

      {/* Hero Dossier Card */}
      <div className="card p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-extrabold text-2xl flex-shrink-0 shadow-lg shadow-indigo-500/20">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3 mb-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{candidate.name}</h1>
              <span className="badge-candidate text-xs">Node: {candidate.id}</span>
            </div>
            <p className="text-base text-indigo-400 font-semibold mb-3">{candidate.title}</p>
            
            <div className="flex flex-wrap gap-4 text-xs text-slate-400 mb-4">
              <div className="flex items-center gap-1.5">
                <MapPin size={14} className="text-slate-500" /> {candidate.location || 'Remote'}
              </div>
              <div className="flex items-center gap-1.5">
                <Briefcase size={14} className="text-slate-500" /> {candidate.experience || 5} Years Experience
              </div>
              {candidate.email && (
                <div className="flex items-center gap-1.5">
                  <Mail size={14} className="text-slate-500" /> {candidate.email}
                </div>
              )}
              <div className="flex items-center gap-1.5 text-indigo-300 bg-indigo-950/60 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
                <Share2 size={12} /> {candidate.directConnectionsCount || directNeighbors.length} Graph Connections
              </div>
            </div>
            
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              {candidate.about || 'Specialist engineer collaborating across distributed organizations with verifiable competencies in the knowledge graph.'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Skills & Projects */}
        <div className="lg:col-span-1 space-y-6">
          {/* Skills Matrix */}
          <div className="card">
            <h2 className="text-sm font-bold text-white mb-4 flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="flex items-center gap-2">
                <Award size={16} className="text-emerald-400" /> Verified Skills Matrix
              </span>
              <span className="text-[11px] text-slate-500">{candidate.skills?.length || 0} skills</span>
            </h2>
            <div className="flex flex-wrap gap-2">
              {candidate.skills && candidate.skills.length > 0 ? (
                candidate.skills.map((skill, idx) => (
                  <SkillBadge 
                    key={idx} 
                    name={skill.name} 
                    proficiency={skill.proficiency} 
                    category={skill.category}
                    size="sm"
                  />
                ))
              ) : (
                <p className="text-xs text-slate-500">No skills currently tagged.</p>
              )}
            </div>
          </div>
          
          {/* Projects */}
          <div className="card">
            <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2 border-b border-slate-800 pb-3">
              <FolderGit2 size={16} className="text-rose-400" /> Graph Projects & Initiatives
            </h2>
            <div className="space-y-3">
              {candidate.projects && candidate.projects.length > 0 ? (
                candidate.projects.map((proj, idx) => (
                  <div key={idx} className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-bold text-xs text-white">{proj.name}</h3>
                      <span className="text-[10px] text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20">
                        {proj.role || 'Contributor'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{proj.desc || 'Key technical contribution to architecture and deployment.'}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500">No specific projects linked.</p>
              )}
            </div>
          </div>
        </div>

        {/* Middle & Right Column: Experience Timeline & Multi-Hop Network */}
        <div className="lg:col-span-2 space-y-6">
          {/* Multi-Hop Network Neighborhood */}
          <div className="card">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b border-slate-800 pb-3">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <Share2 size={16} className="text-indigo-400" />
                  Multi-Hop Network Neighborhood
                </h2>
                <p className="text-[11px] text-slate-400">Traversed via CognoDB openCypher <code className="text-indigo-300 font-mono">[:KNOWS*1..3]</code></p>
              </div>
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                <button
                  onClick={() => setNetworkTab(1)}
                  className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                    networkTab === 1 ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  1st Degree ({directNeighbors.length})
                </button>
                <button
                  onClick={() => setNetworkTab(2)}
                  className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                    networkTab === 2 ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  2nd Degree ({secondDegreeNeighbors.length})
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(networkTab === 1 ? directNeighbors : secondDegreeNeighbors).slice(0, 6).map((peer, idx) => (
                <Link key={idx} href={`/candidates/${peer.id}`} className="group">
                  <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 hover:border-indigo-500/50 transition-all flex items-center justify-between">
                    <div className="min-w-0 pr-2">
                      <h4 className="font-bold text-xs text-white group-hover:text-indigo-400 truncate">{peer.name}</h4>
                      <p className="text-[11px] text-slate-400 truncate">{peer.title}</p>
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 shrink-0">
                      {peer.distance} hop{peer.distance > 1 ? 's' : ''}
                    </span>
                  </div>
                </Link>
              ))}
              {(networkTab === 1 ? directNeighbors : secondDegreeNeighbors).length === 0 && (
                <p className="text-xs text-slate-500 col-span-2 text-center py-4">No connections found in this degree.</p>
              )}
            </div>
          </div>

          {/* Experience Timeline */}
          <div className="card">
            <h2 className="text-sm font-bold text-white mb-6 border-b border-slate-800 pb-3 flex items-center gap-2">
              <Briefcase size={16} className="text-amber-400" /> Career & Company Timeline
            </h2>
            <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-800">
              {candidate.companies && candidate.companies.length > 0 ? (
                candidate.companies.map((exp, idx) => (
                  <div key={idx} className="relative flex items-start gap-4">
                    <div className="w-7 h-7 rounded-full bg-slate-900 border-2 border-indigo-500 flex items-center justify-center shrink-0 z-10">
                      <div className="w-2 h-2 rounded-full bg-indigo-400"></div>
                    </div>
                    <div className="flex-1 p-4 bg-slate-950/60 rounded-xl border border-slate-800">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                        <h3 className="font-bold text-sm text-white">{exp.role || candidate.title}</h3>
                        <span className="text-[11px] font-semibold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20 inline-flex items-center gap-1 self-start sm:self-auto">
                          <Calendar size={12} /> {exp.startYear || '2020'} — {exp.endYear || 'Present'}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-amber-400 mb-2">{exp.name}</p>
                      <p className="text-xs text-slate-400">Engineered key capabilities and contributed to cross-functional milestones.</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500">No company records linked.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CandidateProfilePage() {
  return (
    <ErrorBoundary>
      <CandidateProfileContent />
    </ErrorBoundary>
  );
}
