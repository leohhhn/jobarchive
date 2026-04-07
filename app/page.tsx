import { getJobs } from '@/lib/list-jobs';
import JobList from '@/components/JobList';

export default async function Home() {
  const jobs = await getJobs();

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
            Decentralized job listings powered by Arkiv Network — no middleman,
            no platform risk.
          </p>
        </div>
      </div>

      {/* Jobs */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-6">
          <p
            className="text-sm"
            style={{ color: 'var(--arkiv-ink)', opacity: 0.5 }}
          >
            {jobs.length} open positions
          </p>
        </div>
        <JobList jobs={jobs} />
      </div>
    </main>
  );
}
