'use client';

import React from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary caught error]', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center p-8 bg-rose-950/40 border border-rose-900/50 rounded-2xl m-4 text-center">
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold text-white mb-1">Rendering Encountered an Error</h2>
          <p className="text-xs text-rose-300/80 mb-5 max-w-md">
            {this.state.error?.message || "An unexpected error occurred while rendering this component."}
          </p>
          <button 
            onClick={() => this.setState({ hasError: false, error: null })}
            className="inline-flex items-center gap-2 bg-rose-600/80 hover:bg-rose-600 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
          >
            <RefreshCcw size={14} /> Retry Operation
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
