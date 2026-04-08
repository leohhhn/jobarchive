import { getJobs } from '@/lib/list-jobs';
import JobSearch from '@/components/JobSearch';
import { JOB_CATEGORIES, FETCH_LIMITS, DEFAULT_FETCH_LIMIT } from '@/lib/types';

interface HomeProps {
  searchParams: Promise<{
    category?: string;
    remote?: string;
    limit?: string;
  }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const { category, remote, limit: limitParam } = await searchParams;

  const limit = FETCH_LIMITS.includes(Number(limitParam) as typeof FETCH_LIMITS[number])
    ? Number(limitParam)
    : DEFAULT_FETCH_LIMIT;

  const jobs = await getJobs(
    {
      category: category || undefined,
      remote: remote === 'true' ? true : undefined,
    },
    limit,
  );

  return (
    <main
      className="min-h-screen"
      style={{ backgroundColor: 'var(--arkiv-sand)' }}
    >
      {/* Hero */}
      <div
        style={{ backgroundColor: 'var(--arkiv-blue)' }}
        className="px-6 py-16"
      >
        <div className="max-w-6xl mx-auto">
          <p
            style={{ color: 'var(--arkiv-orange)' }}
            className="text-sm font-medium mb-3 tracking-wider uppercase"
          >
            Web3 · Decentralized · On-chain
          </p>
          <h1 className="text-4xl font-bold text-white mb-3">
            Find your next Web3 role
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)' }} className="text-lg">
            Decentralized job listings powered by Arkiv Network.
          </p>
        </div>
      </div>

      {/* Jobs */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <JobSearch jobs={jobs} categories={[...JOB_CATEGORIES]} limit={limit} />
      </div>
    </main>
  );
}
