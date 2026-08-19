'use client';

import { useState } from 'react';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorBoundary from '../../components/ErrorBoundary';
import { Terminal, Play, Clock, Database, Copy, Check, Sparkles, Layers } from 'lucide-react';

const PRESET_QUERIES = [
  {
    id: 'multihop_referral',
    title: '1. Multi-Hop 2nd/3rd Degree Referral Traversal',
    description: 'Finds candidate peers 2 to 3 hops away who possess Neo4j/CognoDB skill but are not directly connected yet.',
    cypher: `MATCH (c:Candidate {id: 'c_1'})-[:KNOWS*2..3]-(peer:Candidate)-[:HAS_SKILL]->(s:Skill {id: 'sk_neo4j'})
WHERE NOT (c)-[:KNOWS]-(peer) AND peer.id <> 'c_1'
RETURN DISTINCT peer.id AS id, peer.name AS name, peer.title AS title, peer.location AS location
LIMIT 10;`,
    sqlEquivalent: `-- Relational SQL requires a recursive Common Table Expression (CTE) and multiple JOINs
WITH RECURSIVE candidate_network AS (
  -- 1st degree anchor
  SELECT k.candidate_b_id AS candidate_id, 1 AS depth, ARRAY[k.candidate_a_id, k.candidate_b_id] AS path
  FROM candidate_connections k
  WHERE k.candidate_a_id = 'c_1'
  UNION ALL
  -- 2nd & 3rd degree recursive step
  SELECT k.candidate_b_id, cn.depth + 1, path || k.candidate_b_id
  FROM candidate_connections k
  JOIN candidate_network cn ON k.candidate_a_id = cn.candidate_id
  WHERE cn.depth < 3 AND NOT (k.candidate_b_id = ANY(cn.path))
)
SELECT DISTINCT c.id, c.name, c.title, c.location
FROM candidate_network cn
JOIN candidates c ON c.id = cn.candidate_id
JOIN candidate_skills cs ON cs.candidate_id = c.id
JOIN skills s ON s.id = cs.skill_id
WHERE cn.depth BETWEEN 2 AND 3 AND s.id = 'sk_neo4j'
  AND cn.candidate_id NOT IN (SELECT candidate_b_id FROM candidate_connections WHERE candidate_a_id = 'c_1');`
  },
  {
    id: 'shortest_path',
    title: '2. Shortest Career Progression Path',
    description: 'Finds the optimal step-by-step career path between Junior Developer and CTO using graph shortest path algorithm.',
    cypher: `MATCH (start:Role {id: 'r_jdev'}), (end:Role {id: 'r_cto'})
MATCH path = shortestPath((start)-[:LEADS_TO*]->(end))
RETURN [n IN nodes(path) | n.name] AS progressionSteps,
       length(path) AS totalHops;`,
    sqlEquivalent: `-- Relational SQL requires iterative graph search or recursive CTE with cycle detection
WITH RECURSIVE role_path AS (
  SELECT r.id, r.name, 0 AS hops, ARRAY[r.id] AS visited
  FROM roles r WHERE r.id = 'r_jdev'
  UNION ALL
  SELECT next_r.id, next_r.name, rp.hops + 1, visited || next_r.id
  FROM role_progressions p
  JOIN role_path rp ON p.from_role_id = rp.id
  JOIN roles next_r ON next_r.id = p.to_role_id
  WHERE NOT (next_r.id = ANY(rp.visited))
)
SELECT visited, hops FROM role_path WHERE id = 'r_cto' ORDER BY hops ASC LIMIT 1;`
  },
  {
    id: 'skill_gap',
    title: '3. Skill Gap & Role Prerequisite Intersection',
    description: 'Compares role skill requirements against a candidate capabilities with proficiency diff.',
    cypher: `MATCH (r:Role {id: 'r_sdev'})-[:REQUIRES]->(req:Skill)
OPTIONAL MATCH (c:Candidate {id: 'c_1'})-[hs:HAS_SKILL]->(req)
RETURN req.name AS skillName, req.category AS category,
       CASE WHEN hs IS NOT NULL THEN true ELSE false END AS hasSkill,
       coalesce(hs.proficiency, 0) AS currentProficiency;`,
    sqlEquivalent: `SELECT s.name AS skillName, s.category,
       CASE WHEN cs.candidate_id IS NOT NULL THEN TRUE ELSE FALSE END AS hasSkill,
       COALESCE(cs.proficiency, 0) AS currentProficiency
FROM role_skill_requirements rsr
JOIN skills s ON s.id = rsr.skill_id
LEFT JOIN candidate_skills cs ON cs.skill_id = s.id AND cs.candidate_id = 'c_1'
WHERE rsr.role_id = 'r_sdev';`
  },
  {
    id: 'high_degree_influencers',
    title: '4. Network Centrality & High-Degree Hubs',
    description: 'Finds candidate hubs with the highest degree of network connectivity across organizations.',
    cypher: `MATCH (c:Candidate)-[r:KNOWS]-(peer:Candidate)
WITH c, count(peer) AS degreeCount
ORDER BY degreeCount DESC
LIMIT 10
RETURN c.id AS id, c.name AS name, c.title AS title, degreeCount;`,
    sqlEquivalent: `SELECT c.id, c.name, c.title, COUNT(*) AS degreeCount
FROM (
  SELECT candidate_a_id AS cand_id FROM candidate_connections
  UNION ALL
  SELECT candidate_b_id AS cand_id FROM candidate_connections
) connections
JOIN candidates c ON c.id = connections.cand_id
GROUP BY c.id, c.name, c.title
ORDER BY degreeCount DESC
LIMIT 10;`
  }
];

function QueryInspectorContent() {
  const [selectedPreset, setSelectedPreset] = useState(PRESET_QUERIES[0]);
  const [cypherInput, setCypherInput] = useState(PRESET_QUERIES[0].cypher);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSelectPreset = (preset) => {
    setSelectedPreset(preset);
    setCypherInput(preset.cypher);
    setResult(null);
  };

  const handleRunQuery = async () => {
    if (!cypherInput.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cypher: cypherInput })
      });

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Terminal className="w-6 h-6 text-indigo-400" />
            Live Cypher Playground & Query Inspector
          </h1>
          <p className="text-xs text-slate-400">
            Execute openCypher queries live against CognoDB Cloud and compare declarative Cypher syntax with complex Relational SQL.
          </p>
        </div>
      </div>

      {/* Presets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {PRESET_QUERIES.map((preset) => {
          const isSelected = selectedPreset.id === preset.id;
          return (
            <button
              key={preset.id}
              onClick={() => handleSelectPreset(preset)}
              className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-indigo-950/40 border-indigo-500/60 ring-1 ring-indigo-500/40 shadow-lg shadow-indigo-500/10'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
              }`}
            >
              <div>
                <h4 className={`text-xs font-bold mb-1 ${isSelected ? 'text-indigo-300' : 'text-white'}`}>
                  {preset.title}
                </h4>
                <p className="text-[11px] text-slate-400 leading-snug">{preset.description}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Query Editor & SQL Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Cypher Input */}
        <div className="card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Database size={16} className="text-indigo-400" />
              <h3 className="font-bold text-xs text-white uppercase tracking-wider">openCypher Query (CognoDB)</h3>
            </div>
            <button
              onClick={() => handleCopy(cypherInput)}
              className="text-slate-400 hover:text-white text-xs inline-flex items-center gap-1"
            >
              {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>

          <textarea
            className="w-full h-52 bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 leading-relaxed resize-none shadow-inner"
            value={cypherInput}
            onChange={(e) => setCypherInput(e.target.value)}
            spellCheck="false"
          />

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-slate-500">Read-only Cypher queries enabled</span>
            <button
              onClick={handleRunQuery}
              disabled={loading || !cypherInput.trim()}
              className="btn-primary py-2 px-5 text-xs shadow-md"
            >
              <Play size={13} fill="currentColor" /> Run Query
            </button>
          </div>
        </div>

        {/* Right: SQL Comparison */}
        <div className="card p-5 space-y-4 bg-slate-900/60">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Layers size={16} className="text-amber-400" />
              <h3 className="font-bold text-xs text-white uppercase tracking-wider">Equivalent Relational SQL (RDBMS)</h3>
            </div>
          </div>

          <pre className="w-full h-52 bg-slate-950/80 border border-slate-800/80 rounded-xl p-4 font-mono text-xs text-amber-200/80 overflow-auto leading-relaxed shadow-inner">
            <code>{selectedPreset.sqlEquivalent}</code>
          </pre>

          <div className="p-2.5 rounded-lg bg-amber-500/5 border border-amber-500/15 text-[11px] text-amber-300/80">
            💡 Notice how Cypher expresses multi-hop paths in 1 clean line vs recursive SQL CTEs.
          </div>
        </div>
      </div>

      {/* Query Execution Results */}
      {loading && <LoadingSpinner message="Executing Cypher query against CognoDB Bolt endpoint..." />}

      {result && !loading && (
        <div className="card p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-emerald-400" />
              <h3 className="font-bold text-xs text-white uppercase tracking-wider">Execution Output</h3>
            </div>
            
            <div className="flex items-center gap-3 text-xs">
              {result.executionTimeMs !== undefined && (
                <span className="flex items-center gap-1 font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                  <Clock size={12} /> {result.executionTimeMs} ms
                </span>
              )}
              {result.recordsCount !== undefined && (
                <span className="text-slate-400 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
                  {result.recordsCount} record{result.recordsCount !== 1 ? 's' : ''} returned
                </span>
              )}
            </div>
          </div>

          {result.error ? (
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-300 text-xs font-mono">
              Error: {result.error}
            </div>
          ) : result.records && result.records.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse font-mono">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/80 text-slate-400">
                    {Object.keys(result.records[0]).map((key) => (
                      <th key={key} className="p-3 font-semibold text-indigo-300">{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {result.records.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-slate-850/50 transition-colors">
                      {Object.keys(row).map((key, cIdx) => (
                        <td key={cIdx} className="p-3 text-slate-200">
                          {typeof row[key] === 'object' ? JSON.stringify(row[key]) : String(row[key])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic py-2">Query succeeded with 0 records returned.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default function QueryInspectorPage() {
  return (
    <ErrorBoundary>
      <QueryInspectorContent />
    </ErrorBoundary>
  );
}
