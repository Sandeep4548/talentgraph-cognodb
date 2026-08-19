'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import GraphVisualization from '../../components/GraphVisualization';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorBoundary from '../../components/ErrorBoundary';
import { Filter, X, Search, ExternalLink, ArrowRight, Sparkles } from 'lucide-react';

function ExploreContent() {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [loading, setLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    candidate: true,
    skill: true,
    company: true,
    role: true
  });

  useEffect(() => {
    const fetchGraph = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/graph');
        const data = await res.json();
        setGraphData(data || { nodes: [], links: [] });
      } catch (err) {
        console.error('Failed to load graph data', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchGraph();
  }, []);

  const handleFilterChange = (type) => {
    setFilters(prev => ({ ...prev, [type]: !prev[type] }));
  };

  const filteredNodes = graphData.nodes.filter(n => {
    const nodeType = (n.type || 'candidate').toLowerCase();
    const passesType = filters[nodeType] !== false;
    const passesSearch = searchQuery
      ? (n.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
        (n.title || '').toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return passesType && passesSearch;
  });

  const validNodeIds = new Set(filteredNodes.map(n => n.id));

  const filteredLinks = graphData.links.filter(l => {
    const s = typeof l.source === 'object' ? l.source.id : l.source;
    const t = typeof l.target === 'object' ? l.target.id : l.target;
    return validNodeIds.has(s) && validNodeIds.has(t);
  });

  const filteredGraphData = {
    nodes: filteredNodes,
    links: filteredLinks
  };

  const legendItems = [
    { label: 'Candidate', type: 'candidate', color: 'bg-blue-500', count: graphData.nodes.filter(n => (n.type || '').toLowerCase() === 'candidate').length },
    { label: 'Skill', type: 'skill', color: 'bg-emerald-500', count: graphData.nodes.filter(n => (n.type || '').toLowerCase() === 'skill').length },
    { label: 'Company', type: 'company', color: 'bg-amber-500', count: graphData.nodes.filter(n => (n.type || '').toLowerCase() === 'company').length },
    { label: 'Role', type: 'role', color: 'bg-purple-500', count: graphData.nodes.filter(n => (n.type || '').toLowerCase() === 'role').length },
  ];

  return (
    <div className="space-y-4 flex flex-col h-[calc(100vh-130px)] min-h-[600px]">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-indigo-400" />
            Knowledge Graph Explorer
          </h1>
          <p className="text-xs text-slate-400">Interactive openCypher visual canvas across candidate profiles, skills, companies, and roles.</p>
        </div>

        {/* Search within Graph */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search nodes by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Main Canvas & Overlay Controls */}
      <div className="flex flex-1 gap-4 overflow-hidden relative">
        {/* Main Graph Area */}
        <div className="flex-1 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl relative">
          {loading ? (
            <LoadingSpinner message="Querying CognoDB Nodes and Relationships..." />
          ) : (
            <GraphVisualization 
              graphData={filteredGraphData} 
              onNodeClick={(node) => setSelectedNode(node)}
              highlightedNodeId={selectedNode?.id}
              className="w-full h-full"
            />
          )}
          
          {/* Filters Floating Panel */}
          <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-slate-800 shadow-xl z-20 text-xs">
            <div className="flex items-center gap-2 mb-3 font-bold text-white text-xs">
              <Filter size={14} className="text-indigo-400" />
              <span>Node Types</span>
            </div>
            <div className="space-y-2.5">
              {legendItems.map(item => (
                <label key={item.type} className="flex items-center justify-between gap-3 cursor-pointer group">
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      checked={filters[item.type]} 
                      onChange={() => handleFilterChange(item.type)}
                      className="rounded bg-slate-800 border-slate-700 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                    />
                    <div className={`w-2.5 h-2.5 rounded-full ${item.color} shadow-sm`}></div>
                    <span className="text-slate-300 group-hover:text-white font-medium">{item.label}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">({item.count})</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Node Details Slide-out Panel */}
        {selectedNode && (
          <div className="w-80 sm:w-96 bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-slate-800 shadow-2xl p-5 overflow-y-auto flex flex-col justify-between z-30 animate-in slide-in-from-right duration-200">
            <div>
              <div className="flex justify-between items-start mb-4 border-b border-slate-800 pb-3">
                <div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                    selectedNode.type?.toLowerCase() === 'candidate' ? 'badge-candidate' :
                    selectedNode.type?.toLowerCase() === 'skill' ? 'badge-skill' :
                    selectedNode.type?.toLowerCase() === 'company' ? 'badge-company' :
                    'badge-role'
                  }`}>
                    {selectedNode.type}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-1.5">{selectedNode.name || selectedNode.title}</h3>
                  {selectedNode.title && selectedNode.type?.toLowerCase() === 'candidate' && (
                    <p className="text-xs text-indigo-400 font-medium">{selectedNode.title}</p>
                  )}
                </div>
                <button 
                  onClick={() => setSelectedNode(null)}
                  className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
              
              <div className="space-y-3.5 text-xs text-slate-300">
                <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/80 space-y-1.5">
                  <div className="flex justify-between text-slate-400">
                    <span>Graph Node ID:</span>
                    <span className="font-mono text-slate-200">{selectedNode.id}</span>
                  </div>
                  {selectedNode.location && (
                    <div className="flex justify-between text-slate-400">
                      <span>Location:</span>
                      <span className="text-slate-200">{selectedNode.location}</span>
                    </div>
                  )}
                  {selectedNode.category && (
                    <div className="flex justify-between text-slate-400">
                      <span>Category:</span>
                      <span className="text-emerald-400">{selectedNode.category}</span>
                    </div>
                  )}
                  {selectedNode.department && (
                    <div className="flex justify-between text-slate-400">
                      <span>Department:</span>
                      <span className="text-purple-400">{selectedNode.department}</span>
                    </div>
                  )}
                </div>

                <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-800/60">
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Connected in the active knowledge graph. Click on neighbouring nodes to traverse graph relationships.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions at bottom of panel */}
            <div className="pt-4 border-t border-slate-800 mt-4">
              {selectedNode.type?.toLowerCase() === 'candidate' && (
                <Link 
                  href={`/candidates/${selectedNode.id}`}
                  className="btn-primary w-full text-xs py-2"
                >
                  <span>Open Full Dossier</span>
                  <ExternalLink size={14} />
                </Link>
              )}
              {selectedNode.type?.toLowerCase() === 'role' && (
                <Link 
                  href={`/career-paths?role=${selectedNode.id}`}
                  className="btn-primary w-full text-xs py-2"
                >
                  <span>Explore Career Paths</span>
                  <ArrowRight size={14} />
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <ErrorBoundary>
      <ExploreContent />
    </ErrorBoundary>
  );
}
