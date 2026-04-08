'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { extendJob, deleteJob } from '@/lib/job-actions';

const EXTEND_OPTIONS = [
  { label: '7 days', days: 7 },
  { label: '14 days', days: 14 },
  { label: '30 days', days: 30 },
] as const;

export default function JobOwnerActions({
  jobId,
  author,
}: {
  jobId: string;
  author: string;
}) {
  const { address, connector } = useAccount();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!address || address.toLowerCase() !== author.toLowerCase()) return null;

  async function handleExtend(days: number) {
    if (!connector || !address) return;
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await extendJob(connector, address, jobId, days);
      setSuccess(`Listing extended by ${days} days.`);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to extend listing.',
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!connector || !address) return;
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await deleteJob(connector, address, jobId);
      router.push('/');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to delete listing.',
      );
      setLoading(false);
    }
  }

  return (
    <div
      className="bg-white border rounded-2xl p-6 space-y-5"
      style={{ borderColor: 'var(--arkiv-stone)' }}
    >
      <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
        Owner actions
      </h2>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg bg-green-50 border border-green-200 px-3 py-2 text-xs text-green-700">
          {success}
        </div>
      )}

      {/* Extend */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">Extend listing</p>
        <p className="text-xs text-gray-400">
          Add more time to keep this listing active.
        </p>
        <div className="flex gap-2">
          {EXTEND_OPTIONS.map(({ label, days }) => (
            <button
              key={days}
              onClick={() => handleExtend(days)}
              disabled={loading}
              className="px-3 py-1.5 rounded-lg border text-sm font-medium
                         transition-opacity hover:opacity-80 disabled:opacity-40"
              style={{
                borderColor: 'var(--arkiv-blue)',
                color: 'var(--arkiv-blue)',
              }}
            >
              + {label}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t" style={{ borderColor: 'var(--arkiv-stone)' }} />

      {/* Delete */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">Remove listing</p>
        <p className="text-xs text-gray-400">
          Permanently delete this job posting from Arkiv.
        </p>
        {!confirmDelete ? (
          <button
            onClick={() => setConfirmDelete(true)}
            disabled={loading}
            className="px-3 py-1.5 rounded-lg border text-sm font-medium
                       transition-opacity hover:opacity-80 disabled:opacity-40"
            style={{ borderColor: '#ef4444', color: '#ef4444' }}
          >
            Delete listing
          </button>
        ) : (
          <div className="flex gap-2 items-center">
            <p className="text-xs text-gray-500">
              Are you sure? This cannot be undone.
            </p>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="px-3 py-1.5 rounded-lg text-sm font-medium text-white
                         transition-opacity hover:opacity-80 disabled:opacity-40"
              style={{ backgroundColor: '#ef4444' }}
            >
              {loading ? 'Deleting...' : 'Yes, delete'}
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              disabled={loading}
              className="px-3 py-1.5 rounded-lg border text-sm font-medium
                         transition-opacity hover:opacity-80 disabled:opacity-40"
              style={{
                borderColor: 'var(--arkiv-stone)',
                color: 'var(--arkiv-ink)',
              }}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
