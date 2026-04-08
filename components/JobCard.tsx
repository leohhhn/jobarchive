import { JobPosting } from '@/lib/types';
import { formatCompLabel, daysUntilExpiry } from '@/lib/utils';

export default function JobCard({ job }: { job: JobPosting }) {
  const days = daysUntilExpiry(job.expiresAt);
  const compLabel = formatCompLabel(job);

  return (
    <div
      style={{
        backgroundColor: 'white',
        border: '1px solid var(--arkiv-stone)',
      }}
      className="rounded-xl p-6 hover:shadow-md transition-shadow cursor-pointer flex flex-col h-full w-full"
    >
      {/* Header */}
      <div className="mb-3">
        <h2
          style={{ color: 'var(--arkiv-ink)' }}
          className="text-lg font-semibold mb-0.5"
        >
          {job.title}
        </h2>
        <p className="text-sm font-medium text-gray-600">{job.company}</p>
        {compLabel && (
          <p
            style={{ color: 'var(--arkiv-orange)' }}
            className="text-sm font-semibold mt-1"
          >
            {compLabel}
          </p>
        )}
      </div>

      {/* Location + category */}
      <div className="flex gap-2 mb-3 items-center flex-wrap">
        <span className="text-sm text-gray-500">{job.location}</span>
        {job.category && (
          <span
            style={{
              backgroundColor: '#FE744620',
              color: 'var(--arkiv-orange)',
              border: '1px solid #FE744640',
            }}
            className="text-xs px-2 py-0.5 rounded-full font-medium"
          >
            {job.category}
          </span>
        )}
        {job.remote && (
          <span
            style={{
              backgroundColor: '#181EA915',
              color: 'var(--arkiv-blue)',
              border: '1px solid #181EA930',
            }}
            className="text-xs px-2 py-0.5 rounded-full font-medium"
          >
            Remote
          </span>
        )}
      </div>

      {/* Stack — grows to fill space */}
      <div className="flex flex-wrap gap-2 mb-4 flex-1">
        {job.stack.map((tag) => (
          <span
            key={tag}
            style={{
              backgroundColor: 'var(--arkiv-stone)',
              color: 'var(--arkiv-ink)',
            }}
            className="text-xs px-2 py-1 rounded-md font-medium opacity-80 h-fit"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Footer — always at bottom */}
      <div
        className="flex justify-between items-center text-xs text-gray-400 pt-3 border-t"
        style={{ borderColor: 'var(--arkiv-stone)' }}
      >
        <span>Posted {new Date(job.postedAt).toLocaleDateString()}</span>
        <span style={days === 0 || days < 7 ? { color: 'var(--arkiv-orange)' } : {}}>
          {days === 0 ? 'Expired' : `Expires in ${days} days`}
        </span>
      </div>
    </div>
  );
}
