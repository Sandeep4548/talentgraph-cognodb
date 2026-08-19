'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Network, Database, Menu, X, Terminal, Compass, Users, Map, Target } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [dbStatus, setDbStatus] = useState({ isLive: false, checking: true });
  const pathname = usePathname();

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => {
        setDbStatus({
          isLive: data.isLiveDb === true,
          checking: false,
          nodeCount: (data.candidates || 0) + (data.skills || 0) + (data.companies || 0) + (data.roles || 0)
        });
      })
      .catch(() => {
        setDbStatus({ isLive: false, checking: false });
      });
  }, []);

  const navLinks = [
    { name: 'Dashboard', href: '/', icon: Network },
    { name: 'Graph Explorer', href: '/explore', icon: Compass },
    { name: 'Candidates', href: '/candidates', icon: Users },
    { name: 'Career Paths', href: '/career-paths', icon: Map },
    { name: 'Skill Analysis', href: '/skill-analysis', icon: Target },
    { name: 'Cypher Playground', href: '/query-inspector', icon: Terminal },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Brand */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform">
                <Network className="h-5 w-5" />
              </div>
              <div>
                <span className="font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
                  Talent<span className="text-indigo-400">Graph</span>
                </span>
              </div>
            </Link>

            {/* DB Health Indicator */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs">
              <Database className="w-3.5 h-3.5 text-slate-400" />
              {dbStatus.checking ? (
                <span className="text-slate-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                  Checking CognoDB...
                </span>
              ) : dbStatus.isLive ? (
                <span className="text-emerald-400 font-medium flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400"></span>
                  CognoDB Live
                </span>
              ) : (
                <span className="text-amber-400 font-medium flex items-center gap-1.5" title="Run scripts/seed.js with your CognoDB credentials to go live">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  Demo Mode (Ready)
                </span>
              )}
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'text-white bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4 opacity-70" />
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Mobile menu toggle */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950 px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-base font-medium ${
                  isActive
                    ? 'text-white bg-indigo-600/30 text-indigo-300'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Icon className="w-5 h-5" />
                {link.name}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}
