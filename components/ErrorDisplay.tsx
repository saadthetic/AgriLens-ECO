import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ErrorDisplayProps {
  message: string;
  onClear: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onClear }) => {
  return (
    <div className="glass border-l-4 border-amber-400 dark:border-amber-500 p-4 rounded-r-2xl mb-6 max-w-2xl mx-auto animate-in fade-in slide-in-from-top-4 duration-500" role="alert">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-6 w-6 text-amber-500 dark:text-amber-400" />
        </div>
        <div className="ml-3 flex-1">
          <p className="font-bold text-amber-900 dark:text-amber-100">Analysis Error</p>
          <p className="text-sm text-amber-800/80 dark:text-amber-200/80 mt-1">{message}</p>
        </div>
        <div className="ml-auto pl-3">
          <button
            type="button"
            onClick={onClear}
            className="inline-flex rounded-full p-1.5 text-amber-500 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors"
          >
            <span className="sr-only">Dismiss</span>
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
