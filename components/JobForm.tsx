'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useArkiv } from '@/hooks/useArkiv';
import { createJob } from '@/lib/create-job';

export default function JobForm() {
  const router = useRouter();
  const { walletClient, isConnected, connect } = useArkiv();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    company: '',
    location: '',
    remote: false,
    category: 'engineering',
    stack: '',
    description: '',
    compensation: '',
  });

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  }

  async function handleSubmit() {
    if (!walletClient) return;
    setLoading(true);
    try {
      await createJob(walletClient, {
        title: form.title,
        company: form.company,
        location: form.location,
        remote: form.remote,
        category: form.category,
        stack: form.stack.split(',').map((s) => s.trim()),
        description: form.description,
        compensation: form.compensation || undefined,
        author: walletClient.account.address,
        postedAt: Date.now(),
        expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
      });
      router.push('/');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (!isConnected) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 mb-4">Connect your wallet to post a job.</p>
        <button
          onClick={connect}
          className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-3 rounded-lg"
        >
          Connect Wallet
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-8 flex flex-col gap-5">
      <input
        name="title"
        placeholder="Job Title"
        value={form.title}
        onChange={handleChange}
        className="border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-purple-500"
      />
      <input
        name="company"
        placeholder="Company"
        value={form.company}
        onChange={handleChange}
        className="border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-purple-500"
      />
      <input
        name="location"
        placeholder="Location (e.g. Remote, Berlin)"
        value={form.location}
        onChange={handleChange}
        className="border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-purple-500"
      />
      <label className="flex items-center gap-3 text-sm text-gray-600">
        <input
          type="checkbox"
          name="remote"
          checked={form.remote}
          onChange={handleChange}
          className="w-4 h-4 accent-purple-600"
        />
        Remote position
      </label>
      <select
        name="category"
        value={form.category}
        onChange={handleChange}
        className="border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-purple-500"
      >
        <option value="engineering">Engineering</option>
        <option value="devrel">Developer Relations</option>
        <option value="research">Research</option>
        <option value="design">Design</option>
        <option value="other">Other</option>
      </select>
      <input
        name="stack"
        placeholder="Stack (comma separated: typescript, go, solidity)"
        value={form.stack}
        onChange={handleChange}
        className="border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-purple-500"
      />
      <input
        name="compensation"
        placeholder="Compensation (optional: $120k - $150k)"
        value={form.compensation}
        onChange={handleChange}
        className="border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-purple-500"
      />
      <textarea
        name="description"
        placeholder="Job description..."
        value={form.description}
        onChange={handleChange}
        rows={6}
        className="border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-purple-500 resize-none"
      />
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-medium px-6 py-3 rounded-lg transition-colors"
      >
        {loading ? 'Posting...' : 'Post Job'}
      </button>
    </div>
  );
}
