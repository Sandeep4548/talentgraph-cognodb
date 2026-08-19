'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, Lightbulb, Building2, GitBranch, ArrowRight, Sparkles, Terminal, Compass, Map, Target } from 'lucide-react';
import StatsCard from '../components/StatsCard';
import CandidateCard from '../components/CandidateCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorBoundary from '../components/ErrorBoundary';

function DashboardContent() {
  const [stats, setStats] = useState(null);
  const [recentCandidates, setRecentCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [statsRes, candRes] = await Promise.all([
          fetch('/api/stats'),
          fetch('/api/candidates?limit=6')
        ]);

        if (!statsRes.ok || !candRes.ok) {
          throw new Error('Failed to fetch platform metrics');
        }

        const statsData = await statsRes.json();
        const candData = await candRes.json();

        setStats(statsData);
        setRecentCandidates(Array.isArray(candData) ? candData.slice(0, 6) : []);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <LoadingSpinner message="Querying CognoDB Graph Metrics..." />;
  if (error) throw new Error(error);

  return (
    <div className="space-y-8">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900/60 via-slate-900/90 to-slate-900 border border-indigo-500/20 p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Powered by CognoDB openCypher Engine
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
            Professional Network & Talent Intelligence Graph
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6">
            Navigate multi-hop referral chains, calculate optimal career progression ladders using graph shortest paths, and uncover hidden talent beyond flat resume databases.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/explore" className="btn-primary">
              <Compass className="w-4 h-4" /> Open Graph Explorer
            </Link>
            <Link href="/query-inspector" className="btn-secondary">
              <Terminal className="w-4 h-4" /> Cypher Playground
            </Link>
          </div>
        </div>
      </div>

      {/* Network Metrics KPIs */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-white">Graph Topology Metrics</h2>
            <p className="text-xs text-slate-400">Live entity counts and relationship interconnectivity in CognoDB</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard 
            title="Total Candidates" 
            value={stats?.candidates || 0} 
            icon={Users} 
            color="indigo" 
            subtitle="Node Label: Candidate"
          />
          <StatsCard 
            title="Unique Skills" 
            value={stats?.skills || 0} 
            icon={Lightbulb} 
            color="emerald" 
            subtitle="Node Label: Skill"
          />
          <StatsCard 
            title="Companies & Hubs" 
            value={stats?.companies || 0} 
            icon={Building2} 
            color="amber" 
            subtitle="Node Label: Company"
          />
          <StatsCard 
            title="Graph Relationships" 
            value={stats?.relationships || 0} 
            icon={GitBranch} 
            color="purple" 
            subtitle="Edges: KNOWS, HAS_SKILL, LEADS_TO"
          />
        </div>
      </div>

      {/* Quick Action Navigation Cards */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4">Graph Workflows & Discovery Engines</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/explore" className="group">
            <div className="card h-full hover:border-indigo-500/50 hover:bg-slate-850/80 transition-all flex flex-col justify-between">
              <div>
                <div className="w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Compass size={22} />
                </div>
                <h3 className="text-base font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">
                  Interactive Graph Explorer
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  Visual canvas of the talent universe. Filter nodes by Candidates, Skills, Companies, and Roles with dynamic force physics.
                </p>
              </div>
              <div className="flex items-center text-indigo-400 text-xs font-semibold group-hover:text-indigo-300">
                Explore Network <ArrowRight size={14} className="ml-1.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
          
          <Link href="/career-paths" className="group">
            <div className="card h-full hover:border-emerald-500/50 hover:bg-slate-850/80 transition-all flex flex-col justify-between">
              <div>
                <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Map size={22} />
                </div>
                <h3 className="text-base font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                  Shortest Career Paths
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  Compute shortest promotion and transition paths between roles using Cypher's native <code className="text-emerald-300 bg-emerald-950/60 px-1 py-0.5 rounded font-mono">shortestPath()</code>.
                </p>
              </div>
              <div className="flex items-center text-emerald-400 text-xs font-semibold group-hover:text-emerald-300">
                Find Progression <ArrowRight size={14} className="ml-1.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
          
          <Link href="/skill-analysis" className="group">
            <div className="card h-full hover:border-amber-500/50 hover:bg-slate-850/80 transition-all flex flex-col justify-between">
              <div>
                <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Target size={22} />
                </div>
                <h3 className="text-base font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">
                  Skill Gap & Readiness Analysis
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  Diff candidate skills against role graph prerequisites to calculate readiness scores and personalized upskilling pathways.
                </p>
              </div>
              <div className="flex items-center text-amber-400 text-xs font-semibold group-hover:text-amber-300">
                Analyze Skill Gaps <ArrowRight size={14} className="ml-1.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Featured Candidates Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-white">Featured Talent Spotlight</h2>
            <p className="text-xs text-slate-400">Discover candidates connected in the knowledge graph</p>
          </div>
          <Link href="/candidates" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
            View All Directory <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentCandidates.map(candidate => (
            <CandidateCard key={candidate.id} candidate={candidate} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <ErrorBoundary>
      <DashboardContent />
    </ErrorBoundary>
  );
}
