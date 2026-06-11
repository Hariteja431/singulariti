'use client'; // Error components must be Client Components

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service in production
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mb-6">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h2 className="text-3xl font-black text-ink mb-3 tracking-tight">Something went wrong</h2>
      <p className="text-slate max-w-md mx-auto mb-8 text-sm">
        An unexpected error occurred while running this tool. Our team has been notified.
      </p>
      
      <div className="flex items-center gap-4">
        <button
          onClick={() => reset()}
          className="px-6 py-2.5 bg-primary text-white font-medium rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
        >
          Try again
        </button>
        <Link 
          href="/"
          className="px-6 py-2.5 bg-surface text-ink font-medium rounded-xl hover:bg-slate/5 transition-colors border border-border"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
