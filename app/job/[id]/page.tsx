import Link from 'next/link';
import { getJob } from '@/lib/get-job';
import JobNotFound from './not-found';

function daysUntilExpiry(expiresAt: number): number {
  return Math.ceil((expiresAt - Date.now()) / (1000 * 60 * 60 * 24));
}

export default async function JobPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const job = await getJob(id);
  if (!job) return JobNotFound();

  const days = daysUntilExpiry(job.expiresAt);

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-6 py-10 space-y-6">
        {/* Back */}
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
          ← Back to listings
        </Link>

        {/* Header card */}
        <div className="bg-white border border-gray-200 rounded-xl p-8">
          <div className="flex justify-between items-start gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                {job.title}
              </h1>
              <p className="text-gray-500">{job.company}</p>
              {job.compensation && (
                <p className="text-green-600 font-medium mt-1">
                  {job.compensation}
                </p>
              )}
            </div>
            <div className="flex flex-col items-end gap-2 shrink-0">
              {job.remote && (
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                  Remote
                </span>
              )}
              <span
                className={`text-xs ${days < 7 ? 'text-red-400' : 'text-gray-400'}`}
              >
                Expires in {days} days
              </span>
            </div>
          </div>

          {/* Meta row */}
          <div className="flex flex-wrap gap-4 mt-5 pt-5 border-t border-gray-100 text-sm text-gray-500">
            <span>📍 {job.location}</span>
            {job.category && <span>🏷 {job.category}</span>}
            <span>📅 Posted {new Date(job.postedAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Stack */}
        {job.stack.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">Stack</h2>
            <div className="flex flex-wrap gap-2">
              {job.stack.map((tag) => (
                <span
                  key={tag}
                  className="text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded-md"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">
            Description
          </h2>
          <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
            {job.description}
          </p>
        </div>

        {/* Footer */}
        <div className="text-xs text-gray-400 text-center pb-4">
          Posted by{' '}
          <span className="font-mono">
            {job.author.slice(0, 6)}...{job.author.slice(-4)}
          </span>
          {' · '}
          Entity key:{' '}
          <a
            href={`https://explorer.kaolin.hoodi.arkiv.network/tx/${job.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono underline hover:text-gray-600"
          >
            {job.id.slice(0, 10)}...
          </a>
        </div>
      </div>
    </main>
  );
}
