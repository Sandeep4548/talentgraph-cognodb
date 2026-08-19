import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ message = 'Traversing graph nodes...' }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-4">
      <div className="relative">
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
        </div>
      </div>
      {message && <p className="text-sm font-medium text-slate-400 tracking-wide">{message}</p>}
    </div>
  );
}
