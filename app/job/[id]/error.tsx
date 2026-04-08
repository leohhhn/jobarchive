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
    <main className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--arkiv-sand)' }}>
      <div className="text-center space-y-4 px-6">
        <p className="text-5xl">⚠️</p>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--arkiv-ink)' }}>
          Something went wrong
        </h1>
        <p className="text-gray-500 text-sm max-w-sm">
          We couldn't load this job listing. This might be a network issue or
          the Arkiv node may be temporarily unreachable.
        </p>
        <p className="font-mono text-xs text-gray-400 px-3 py-2 rounded-lg max-w-sm mx-auto break-all" style={{ backgroundColor: 'var(--arkiv-stone)' }}>
          {error.message}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-opacity hover:opacity-90"
            style={{ backgroundColor: 'var(--arkiv-blue)' }}
          >
            Try again
          </button>
          <Link
            href="/"
            className="text-sm font-medium px-5 py-2.5 rounded-lg transition-colors hover:opacity-80"
            style={{ border: '1px solid var(--arkiv-stone)', color: 'var(--arkiv-ink)' }}
          >
            Back to listings
          </Link>
        </div>
      </div>
    </main>
  );
}
