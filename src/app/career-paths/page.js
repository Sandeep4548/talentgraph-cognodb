'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import CareerPathDiagram from '../../components/CareerPathDiagram';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorBoundary from '../../components/ErrorBoundary';
import { Map, ArrowRight, Sparkles, Route, Zap } from 'lucide-react';

function CareerPathsContent() {
  const searchParams = useSearchParams();
  const initialRole = searchParams.get('role') || '';

  const [roles, setRoles] = useState([]);
  const [fromRole, setFromRole] = useState(initialRole || '');
  const [toRole, setToRole] = useState('');
  const [pathData, setPathData] = useState([]);
  const [pathLength, setPathLength] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    fetch('/api/roles')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setRoles(data);
          if (!fromRole && data.length > 0) {
            setFromRole(data[0].id);
          }
          if (data.length > 4) {
            setToRole(data[4].id);
          }
        }
      })
      .catch(err => console.error('Failed to load roles:', err));
  }, []);

  const handleFindPath = async (startId = fromRole, targetId = toRole) => {
    if (!startId || !targetId) return;
    
    setLoading(true);
    setSearched(true);
    
    try {
      const res = await fetch(`/api/analytics?type=career-path&fromRole=${encodeURIComponent(startId)}&toRole=${encodeURIComponent(targetId)}`);
      const data = await res.json();
      setPathData(data.pathNodes || []);
      setPathLength(data.length || 0);
    } catch (err) {
      console.error('Failed to compute career path:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePreset = (start, target) => {
    setFromRole(start);
    setToRole(target);
    handleFindPath(start, target);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Route className="w-6 h-6 text-indigo-400" />
            Career Path & Progression Planner
          </h1>
          <p className="text-xs text-slate-400">
            Powered by openCypher <code className="text-indigo-300 font-mono">{"shortestPath((start:Role)-[:LEADS_TO*]->(end:Role))"}</code>
          </p>
        </div>
      </div>

      {/* Preset Quick Transitions */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-slate-400 font-medium flex items-center gap-1">
          <Zap size={13} className="text-amber-400" /> Quick Presets:
        </span>
        <button
          onClick={() => handlePreset('r_jdev', 'r_peng')}
          className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-indigo-500/50 transition-colors"
        >
          Junior Dev → Principal Engineer
        </button>
        <button
          onClick={() => handlePreset('r_sdev', 'r_cto')}
          className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-indigo-500/50 transition-colors"
        >
          Senior Dev → CTO
        </button>
        <button
          onClick={() => handlePreset('r_da', 'r_hai')}
          className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-indigo-500/50 transition-colors"
        >
          Data Analyst → Head of AI
        </button>
        <button
          onClick={() => handlePreset('r_devo', 'r_plat')}
          className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-indigo-500/50 transition-colors"
        >
          DevOps → Platform Architect
        </button>
      </div>

      {/* Role Selectors Card */}
      <div className="card p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div className="md:col-span-2 space-y-1.5">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Starting Role
            </label>
            <select 
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-slate-200 text-sm"
              value={fromRole}
              onChange={(e) => setFromRole(e.target.value)}
            >
              <option value="">Select starting position...</option>
              {roles.map(r => (
                <option key={r.id} value={r.id}>{r.name} ({r.department})</option>
              ))}
            </select>
          </div>
          
          <div className="md:col-span-2 space-y-1.5">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Destination Target Role
            </label>
            <select 
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-slate-200 text-sm"
              value={toRole}
              onChange={(e) => setToRole(e.target.value)}
            >
              <option value="">Select destination position...</option>
              {roles.map(r => (
                <option key={r.id} value={r.id}>{r.name} ({r.department})</option>
              ))}
            </select>
          </div>
          
          <div className="md:col-span-1">
            <button 
              className="btn-primary w-full h-[42px] text-xs"
              onClick={() => handleFindPath(fromRole, toRole)}
              disabled={!fromRole || !toRole || loading}
            >
              <span>Calculate Path</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Results Display */}
      <div className="mt-4">
        {loading ? (
          <LoadingSpinner message="Calculating graph shortest path in CognoDB..." />
        ) : (
          searched && <CareerPathDiagram path={pathData} length={pathLength} />
        )}
        
        {!searched && !loading && (
          <div className="text-center p-12 text-slate-400 bg-slate-900/60 rounded-2xl border border-dashed border-slate-800">
            <Map className="w-10 h-10 text-slate-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white mb-1">Select Two Roles to Calculate Progression</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              CognoDB evaluates all candidate career transitions and role ladders to find the fastest qualification path.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CareerPathsPage() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner message="Loading Career Paths Planner..." />}>
        <CareerPathsContent />
      </Suspense>
    </ErrorBoundary>
  );
}
