import Link from 'next/link';

export default function JobNotFound() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center space-y-4 px-6">
        <p className="text-5xl">🔍</p>
        <h1 className="text-2xl font-bold text-gray-900">Job not found</h1>
        <p className="text-gray-500 text-sm max-w-sm">
          This listing may have expired or the link might be incorrect. Arkiv
          entities have a finite lifespan — this one may no longer exist
          on-chain.
        </p>
        <Link
          href="/"
          className="inline-block mt-2 bg-purple-600 hover:bg-purple-700 text-white
                     text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
        >
          Back to listings
        </Link>
      </div>
    </main>
  );
}
