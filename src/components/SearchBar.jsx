'use client';

import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBar({ placeholder = 'Search by name, title, skill...', onSearch, value = '', className = '' }) {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (onSearch && localValue !== value) {
        onSearch(localValue);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [localValue, onSearch, value]);

  const handleClear = () => {
    setLocalValue('');
    if (onSearch) onSearch('');
  };

  return (
    <div className={`relative flex items-center ${className}`}>
      <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
      <input
        type="text"
        className="w-full pl-10 pr-10 py-2.5 bg-slate-900/90 border border-slate-750 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-slate-100 placeholder-slate-500 text-sm transition-all shadow-inner"
        placeholder={placeholder}
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
      />
      {localValue && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
