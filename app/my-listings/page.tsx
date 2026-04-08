'use client';

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import Link from 'next/link';
import { getMyJobs } from '@/lib/list-jobs';
import { JobPosting } from '@/lib/types';
import { daysUntilExpiry, formatCompLabel } from '@/lib/utils';
import { useIsMounted } from '@/hooks/useIsMounted';

export default function MyListingsPage() {
  const { address, isConnected } = useAccount();
  const mounted = useIsMounted();
  // null = fetch in progress, [] = loaded but empty
  const [jobs, setJobs] = useState<JobPosting[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!address) return;
    getMyJobs(address)
      .then((result) => setJobs(result))
      .catch((err) => {
        setJobs([]);
        setError(
          err instanceof Error ? err.message : 'Failed to load listings.',
        );
      });
  }, [address]);

  if (!mounted) return null;

  return (
    <main
      className="min-h-screen"
      style={{ backgroundColor: 'var(--arkiv-sand)' }}
    >
      <div className="max-w-3xl mx-auto px-6 py-10 space-y-6">
        {/* Header */}
        <div className="space-y-1">
          <h1
            className="text-2xl font-bold"
            style={{ color: 'var(--arkiv-ink)' }}
          >
            My Listings
          </h1>
          {address && (
            <p className="text-xs font-mono text-gray-400">
              Showing on-chain entities owned by{' '}
              <a
                href={`https://explorer.kaolin.hoodi.arkiv.network/address/${address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-gray-600 transition-colors"
              >
                {address.slice(0, 6)}...{address.slice(-4)}
              </a>
            </p>
          )}
        </div>

        {/* Not connected */}
        {!isConnected && (
          <div
            className="rounded-xl border px-6 py-10 text-center text-sm text-gray-500"
            style={{
              borderColor: 'var(--arkiv-stone)',
              backgroundColor: 'white',
            }}
          >
            Connect your wallet to see your listings.
          </div>
        )}

        {/* Loading */}
        {isConnected && jobs === null && (
          <div className="text-sm text-gray-400 py-10 text-center">
            Fetching your on-chain listings...
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Empty */}
        {isConnected && jobs !== null && !error && jobs.length === 0 && (
          <div
            className="rounded-xl border px-6 py-10 text-center space-y-3"
            style={{
              borderColor: 'var(--arkiv-stone)',
              backgroundColor: 'white',
            }}
          >
            <p className="text-sm text-gray-500">
              You have no active listings on JobArchive.
            </p>
            <Link
              href="/new"
              className="inline-block text-sm font-medium px-4 py-2 rounded-lg text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: 'var(--arkiv-orange)' }}
            >
              Post your first job
            </Link>
          </div>
        )}

        {/* Listings */}
        {jobs !== null && jobs.length > 0 && (
          <div className="space-y-3">
            {jobs.map((job) => (
              <ListingRow key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function ListingRow({ job }: { job: JobPosting }) {
  const days = daysUntilExpiry(job.expiresAt);
  const compLabel = formatCompLabel(job);
  const expired = days === 0;
  const expiringSoon = !expired && days < 7;

  return (
    <Link href={`/job/${job.id}`}>
      <div
        className="bg-white rounded-xl border px-5 py-4 flex items-center justify-between gap-4
                   hover:shadow-md transition-shadow"
        style={{ borderColor: 'var(--arkiv-stone)' }}
      >
        <div className="min-w-0 space-y-0.5">
          <p
            className="font-semibold text-sm truncate"
            style={{ color: 'var(--arkiv-ink)' }}
          >
            {job.title}
          </p>
          <p className="text-xs text-gray-500 truncate">
            {job.company}
            {compLabel && (
              <span style={{ color: 'var(--arkiv-orange)' }}>
                {' '}
                · {compLabel}
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {/* Category */}
          {job.category && (
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium hidden sm:inline"
              style={{
                backgroundColor: '#FE744620',
                color: 'var(--arkiv-orange)',
                border: '1px solid #FE744640',
              }}
            >
              {job.category}
            </span>
          )}

          {/* Expiry badge */}
          <span
            className="text-xs px-2.5 py-1 rounded-full font-medium"
            style={
              expired
                ? {
                    backgroundColor: 'var(--arkiv-stone)',
                    color: 'var(--arkiv-ink)',
                    opacity: 0.5,
                  }
                : expiringSoon
                  ? { backgroundColor: '#fff0ed', color: 'var(--arkiv-orange)' }
                  : { backgroundColor: '#181EA910', color: 'var(--arkiv-blue)' }
            }
          >
            {expired
              ? 'Expired'
              : expiringSoon
                ? `⚠ ${days}d left`
                : `${days}d left`}
          </span>

          {/* Arrow */}
          <svg
            className="w-4 h-4 text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </Link>
  );
}
