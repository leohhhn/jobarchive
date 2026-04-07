import JobForm from '@/components/JobForm';

export default function NewJobPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <JobForm />
      </div>
    </main>
  );
}
