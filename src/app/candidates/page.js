'use client';

import { useState, useEffect } from 'react';
import SearchBar from '../../components/SearchBar';
import CandidateCard from '../../components/CandidateCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import ErrorBoundary from '../../components/ErrorBoundary';
import { Users, Filter, Sparkles } from 'lucide-react';

function CandidatesContent() {
  const [candidates, setCandidates] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');

  useEffect(() => {
    // Fetch available skills for the filter dropdown
    fetch('/api/skills')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setSkills(data);
        }
      })
      .catch(err => console.error('Failed to load skills:', err));
  }, []);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (searchQuery) params.append('search', searchQuery);
        if (selectedSkill) params.append('skill', selectedSkill);

        const res = await fetch(`/api/candidates?${params.toString()}`);
        const data = await res.json();
        setCandidates(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to fetch candidates:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, [searchQuery, selectedSkill]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-400" />
            Candidate Directory
          </h1>
          <p className="text-xs text-slate-400">Search and explore verified talent profiles interconnected in the knowledge graph.</p>
        </div>
        <div className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 self-start sm:self-auto">
          <span>{candidates.length} Profiles Matched</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="card p-4 flex flex-col md:flex-row gap-3">
        <div className="flex-1">
          <SearchBar 
            placeholder="Search candidates by name, job title, or location..." 
            value={searchQuery}
            onSearch={setSearchQuery}
          />
        </div>
        <div className="md:w-64 relative">
          <select 
            className="w-full px-4 py-2.5 bg-slate-900/90 border border-slate-750 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-slate-200 text-sm appearance-none cursor-pointer"
            value={selectedSkill}
            onChange={(e) => setSelectedSkill(e.target.value)}
          >
            <option value="">All Graph Skills</option>
            {skills.map(skill => (
              <option key={skill.id || skill.name} value={skill.name}>
                {skill.name} {skill.candidateCount ? `(${skill.candidateCount})` : ''}
              </option>
            ))}
          </select>
          <Filter className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Results Grid */}
      {loading ? (
        <LoadingSpinner message="Querying CognoDB for matching candidates..." />
      ) : candidates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {candidates.map(candidate => (
            <CandidateCard key={candidate.id} candidate={candidate} />
          ))}
        </div>
      ) : (
        <EmptyState 
          title="No Matching Candidates Found" 
          description="Try broadening your search term or selecting a different skill filter."
          icon={Users}
          action={{ label: 'Clear Filters', onClick: () => { setSearchQuery(''); setSelectedSkill(''); } }}
        />
      )}
    </div>
  );
}

export default function CandidatesPage() {
  return (
    <ErrorBoundary>
      <CandidatesContent />
    </ErrorBoundary>
  );
}
