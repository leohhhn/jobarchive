import { JobPosting } from '@/lib/types';

interface JobCardProps {
  job: JobPosting;
}

function daysUntilExpiry(expiresAt: string): number {
  const now = new Date();
  const expiry = new Date(expiresAt);
  const diff = expiry.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default function JobCard({ job }: JobCardProps) {
  const days = daysUntilExpiry(job.expiresAt);

  return (
    <div className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow bg-white">
      {/* Header */}
      <div className="mb-3">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">
          {job.title}
        </h2>
        <p className="text-gray-500 text-sm">{job.company}</p>
        {job.compensation && (
          <p className="text-sm font-medium text-green-600 mt-1">
            {job.compensation}
          </p>
        )}
      </div>

      {/* Location */}
      <div className="flex gap-2 mb-3 items-center">
        <span className="text-sm text-gray-500">{job.location}</span>
        {job.remote && (
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
            Remote
          </span>
        )}
      </div>

      {/* Stack tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {job.stack.map((tag) => (
          <span
            key={tag}
            className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center text-xs text-gray-400">
        <span>Posted {new Date(job.postedAt).toLocaleDateString()}</span>
        <span className={days < 7 ? 'text-red-400' : 'text-gray-400'}>
          Expires in {days} days
        </span>
      </div>
    </div>
  );
}
