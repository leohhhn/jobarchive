import Link from 'next/link';
import { getJob } from '@/lib/get-job';
import JobOwnerActions from '@/components/JobOwnerActions';
import { notFound } from 'next/navigation';
import { formatCompLabel, daysUntilExpiry } from '@/lib/utils';

export default async function JobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = await getJob(id as `0x${string}`);
  if (!job) notFound();

  const days = daysUntilExpiry(job.expiresAt);
  const isExpiringSoon = days < 7;

  const compLabel = formatCompLabel(job);

  return (
    <main
      className="min-h-screen"
      style={{ backgroundColor: 'var(--arkiv-sand)' }}
    >
      <div className="max-w-3xl mx-auto px-6 py-10 space-y-5">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to listings
        </Link>

        {/* Header */}
        <div
          className="bg-white border rounded-2xl p-8"
          style={{ borderColor: 'var(--arkiv-stone)' }}
        >
          <div className="flex justify-between items-start gap-6">
            <div className="space-y-1.5">
              <h1
                className="text-2xl font-bold"
                style={{ color: 'var(--arkiv-ink)' }}
              >
                {job.title}
              </h1>
              <p className="text-gray-500 font-medium">{job.company}</p>
              {compLabel && (
                <p
                  className="font-semibold text-lg"
                  style={{ color: 'var(--arkiv-orange)' }}
                >
                  {compLabel}
                </p>
              )}
            </div>
            <div className="flex flex-col items-end gap-2 shrink-0 pt-1">
              {job.remote && (
                <span
                  className="text-xs font-medium px-3 py-1 rounded-full"
                  style={{
                    backgroundColor: '#181EA915',
                    color: 'var(--arkiv-blue)',
                    border: '1px solid #181EA930',
                  }}
                >
                  Remote
                </span>
              )}
              <span
                className="text-xs font-medium px-3 py-1 rounded-full"
                style={
                  isExpiringSoon
                    ? {
                        backgroundColor: '#fff0ed',
                        color: 'var(--arkiv-orange)',
                      }
                    : {
                        backgroundColor: 'var(--arkiv-stone)',
                        color: 'var(--arkiv-ink)',
                        opacity: 0.6,
                      }
                }
              >
                {days === 0
                  ? 'Expired'
                  : isExpiringSoon
                    ? `⚠ Expires in ${days}d`
                    : `Expires in ${days} days`}
              </span>
            </div>
          </div>

          {/* Meta */}
          <div
            className="flex flex-wrap gap-x-6 gap-y-2 mt-6 pt-6 border-t"
            style={{ borderColor: 'var(--arkiv-stone)' }}
          >
            <Meta
              icon={
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              }
              label={job.location}
            />
            {job.category && (
              <Meta
                icon={
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                }
                label={job.category}
              />
            )}
            <Meta
              icon={
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              }
              label={`Posted ${new Date(job.postedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}
            />
          </div>
        </div>

        {/* Stack */}
        {job.stack.length > 0 && (
          <div
            className="bg-white border rounded-2xl p-6"
            style={{ borderColor: 'var(--arkiv-stone)' }}
          >
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Tech Stack
            </h2>
            <div className="flex flex-wrap gap-2">
              {job.stack.map((tag) => (
                <span
                  key={tag}
                  className="text-sm px-3 py-1.5 rounded-lg font-medium"
                  style={{
                    backgroundColor: 'var(--arkiv-stone)',
                    color: 'var(--arkiv-ink)',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        <div
          className="bg-white border rounded-2xl p-6"
          style={{ borderColor: 'var(--arkiv-stone)' }}
        >
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
            About the role
          </h2>
          <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
            {job.description}
          </p>
        </div>

        {/* Apply */}
        {job.applyUrl && (
          <a
            href={job.applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-3.5 rounded-xl text-white text-sm font-semibold
                       text-center transition-opacity hover:opacity-90"
            style={{ backgroundColor: 'var(--arkiv-orange)' }}
          >
            Apply for this role →
          </a>
        )}

        {/* Owner actions */}
        <JobOwnerActions jobId={job.id} author={job.author} />

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-gray-400 px-1 pb-4">
          <span className="flex items-center gap-1">
            Posted by{' '}
            <a
              href={`https://explorer.kaolin.hoodi.arkiv.network/address/${job.author}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono hover:text-gray-600 underline transition-colors"
            >
              {job.author.slice(0, 6)}...{job.author.slice(-4)}
            </a>
          </span>

          <a
            href={`https://explorer.kaolin.hoodi.arkiv.network/entity/${job.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-gray-600 transition-colors"
          >
            View on explorer
            <svg
              className="w-3 h-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>
      </div>
    </main>
  );
}

function Meta({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-1.5 text-sm text-gray-500">
      <span className="text-gray-400">{icon}</span>
      {label}
    </div>
  );
}
