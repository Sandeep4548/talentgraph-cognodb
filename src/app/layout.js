import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '../components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'TalentGraph — CognoDB Graph Intelligence Platform',
  description: 'Enterprise talent discovery, career path optimization, and multi-hop referral intelligence powered by CognoDB graph database.',
  keywords: 'graph database, openCypher, CognoDB, Neo4j, talent discovery, talent graph, career path, skill gap analysis'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-slate-950 text-slate-100 flex flex-col`}>
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
        <footer className="border-t border-slate-850 bg-slate-950/60 py-6 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>TalentGraph — Powered by <span className="text-indigo-400 font-semibold">CognoDB</span> Cloud & openCypher</p>
            <div className="flex items-center gap-4 text-slate-400">
              <span>Bolt Protocol 5.x</span>
              <span>•</span>
              <span>Neo4j JavaScript Driver</span>
              <span>•</span>
              <span>Next.js 14</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
