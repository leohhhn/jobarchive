import { JobPosting } from '@/lib/types';

function daysUntilExpiry(expiresAt: number): number {
  return Math.ceil((expiresAt - Date.now()) / (1000 * 60 * 60 * 24));
}

export default function JobCard({ job }: { job: JobPosting }) {
  const days = daysUntilExpiry(job.expiresAt);

  return (
    <div
      style={{
        backgroundColor: 'white',
        border: '1px solid var(--arkiv-stone)',
      }}
      className="rounded-xl p-6 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="mb-3">
        <h2
          style={{ color: 'var(--arkiv-ink)' }}
          className="text-lg font-semibold mb-1"
        >
          {job.title}
        </h2>
        <p className="text-gray-500 text-sm">{job.company}</p>
        {job.compensation && (
          <p
            style={{ color: 'var(--arkiv-orange)' }}
            className="text-sm font-semibold mt-1"
          >
            {job.compensation}
          </p>
        )}
      </div>

      <div className="flex gap-2 mb-3 items-center">
        <span className="text-sm text-gray-500">{job.location}</span>
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

      <div className="flex flex-wrap gap-2 mb-4">
        {job.stack.map((tag) => (
          <span
            key={tag}
            style={{
              backgroundColor: 'var(--arkiv-stone)',
              color: 'var(--arkiv-ink)',
            }}
            className="text-xs px-2 py-1 rounded-md font-medium opacity-80"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex justify-between items-center text-xs text-gray-400">
        <span>Posted {new Date(job.postedAt).toLocaleDateString()}</span>
        <span style={days < 7 ? { color: 'var(--arkiv-orange)' } : {}}>
          Expires in {days} days
        </span>
      </div>
    </div>
  );
}
