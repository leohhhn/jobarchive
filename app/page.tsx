import { getJobs } from '@/lib/read-jobs';
import JobList from '@/components/JobList';

export default async function Home() {
  const jobs = await getJobs();

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <nav className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <span className="font-bold text-gray-900 text-lg">Web3 Jobs</span>
            <span className="ml-2 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
              powered by Arkiv
            </span>
          </div>
          <button className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
            Post a Job
          </button>
        </div>
      </nav>

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
