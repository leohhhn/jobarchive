import JobForm from '@/components/JobForm';

export default function NewJobPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Post a Job</h1>
        <p className="text-gray-500 mb-8">
          Listing will be live for 30 days, then automatically removed.
        </p>
        <JobForm />
      </div>
    </main>
  );
}
