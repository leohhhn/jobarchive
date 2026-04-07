  import { getJobs } from '@/lib/list-jobs';
  import JobList from '@/components/JobList';

  export default async function Home() {
    const jobs = await getJobs();

    return (
      <main className="min-h-screen bg-slate-50">
        {/* Hero */}
        <div className="bg-white border-b border-gray-200 px-6 py-12">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Find your next Web3 role
            </h1>
            <p className="text-gray-500 text-lg">
              Decentralized job listings powered by Arkiv Network — no middleman,
              no platform risk.
            </p>
          </div>
        </div>

        {/* Jobs */}
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="flex justify-between items-center mb-6">
            <p className="text-sm text-gray-500">{jobs.length} open positions</p>
          </div>
          <JobList jobs={jobs} />
        </div>
      </main>
    );
  }
