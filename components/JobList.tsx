import Link from 'next/link';
import { JobPosting } from '@/lib/types';
import JobCard from './JobCard';

interface JobListProps {
  jobs: JobPosting[];
}

export default function JobList({ jobs }: JobListProps) {
  if (jobs.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400">
        No job postings found.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
      {jobs.map((job) => (
        <Link key={job.id} href={`/job/${job.id}`} className="flex w-full">
          <JobCard job={job} />
        </Link>
      ))}
    </div>
  );
}
