'use client';

import Link from 'next/link';

export default function JobError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center space-y-4 px-6">
        <p className="text-5xl">⚠️</p>
        <h1 className="text-2xl font-bold text-gray-900">
          Something went wrong
        </h1>
        <p className="text-gray-500 text-sm max-w-sm">
          We couldn't load this job listing. This might be a network issue or
          the Arkiv node may be temporarily unreachable.
        </p>
        <p className="font-mono text-xs text-gray-400 bg-gray-100 px-3 py-2 rounded-lg max-w-sm mx-auto break-all">
          {error.message}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="bg-purple-600 hover:bg-purple-700 text-white text-sm
                       font-medium px-5 py-2.5 rounded-lg transition-colors"
          >
            Try again
          </button>
          <Link
            href="/"
            className="border border-gray-200 hover:bg-gray-50 text-gray-600 text-sm
                       font-medium px-5 py-2.5 rounded-lg transition-colors"
          >
            Back to listings
          </Link>
        </div>
      </div>
    </main>
  );
}
