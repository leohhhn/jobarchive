'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useState, useMemo, useTransition } from 'react';
import { JobSearchProps, COMP_RANGES, FETCH_LIMITS } from '@/lib/types';
import JobList from './JobList';

export default function JobSearch({ jobs, categories, limit }: JobSearchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [text, setText] = useState('');

  const activeCategory = searchParams.get('category') ?? '';
  const activeRemote = searchParams.get('remote') === 'true';
  const activeCompMin = searchParams.get('compMin') ?? '';

  function updateParams(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value !== null) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  const filtered = useMemo(() => {
    let result = jobs;

    if (text.trim()) {
      const q = text.toLowerCase();
      result = result.filter(
        (job) =>
          job.title.toLowerCase().includes(q) ||
          job.company.toLowerCase().includes(q) ||
          job.location.toLowerCase().includes(q),
      );
    }

    return result;
  }, [jobs, text]);

  const hasActiveFilters = !!(activeCategory || activeRemote || text);

  return (
    <div className="space-y-6">
      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Text search */}
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35M17 11A6 6 0 111 11a6 6 0 0116 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search by title, company, location..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border text-sm bg-white
                       focus:outline-none focus:ring-2 focus:ring-[#181EA940]"
            style={{ borderColor: 'var(--arkiv-stone)' }}
          />
        </div>

        {/* Category filter */}
        <select
          value={activeCategory}
          onChange={(e) => updateParams({ category: e.target.value || null })}
          className="px-3 py-2 rounded-lg border text-sm bg-white
                     focus:outline-none focus:ring-2 focus:ring-[#181EA940]"
          style={{ borderColor: 'var(--arkiv-stone)' }}
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        {/* Comp filter */}
        <select
          value={activeCompMin}
          onChange={(e) => {
            if (!e.target.value) {
              updateParams({ compMin: null, compMax: null });
              return;
            }
            const range = COMP_RANGES.find(
              (r) => r.min === Number(e.target.value),
            );
            if (range) {
              updateParams({
                compMin: String(range.min),
                compMax: range.max ? String(range.max) : null,
              });
            }
          }}
          className="px-3 py-2 rounded-lg border text-sm bg-white focus:outline-none"
          style={{ borderColor: 'var(--arkiv-stone)' }}
        >
          <option value="">Any salary</option>
          {COMP_RANGES.map((r) => (
            <option key={r.min} value={r.min}>
              {r.label}
            </option>
          ))}
        </select>

        {/* Remote toggle */}
        <button
          onClick={() => updateParams({ remote: activeRemote ? null : 'true' })}
          className="px-4 py-2 rounded-lg border text-sm font-medium transition-colors"
          style={
            activeRemote
              ? {
                  backgroundColor: 'var(--arkiv-blue)',
                  color: 'white',
                  borderColor: 'var(--arkiv-blue)',
                }
              : {
                  backgroundColor: 'white',
                  borderColor: 'var(--arkiv-stone)',
                  color: 'var(--arkiv-ink)',
                }
          }
        >
          Remote only
        </button>
      </div>

      {/* Results count + limit selector + clear */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <p
            className="text-sm"
            style={{ color: 'var(--arkiv-ink)', opacity: 0.5 }}
          >
            {isPending ? 'Loading...' : `${filtered.length} open positions`}
          </p>
          <select
            value={limit}
            onChange={(e) => updateParams({ limit: e.target.value })}
            className="px-2 py-1 rounded-lg border text-xs bg-white focus:outline-none"
            style={{
              borderColor: 'var(--arkiv-stone)',
              color: 'var(--arkiv-ink)',
            }}
          >
            {FETCH_LIMITS.map((l) => (
              <option key={l} value={l}>
                Show {l}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={() => {
            setText('');
            startTransition(() => router.push(pathname));
          }}
          className="text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors"
          style={{
            borderColor: 'var(--arkiv-stone)',
            color: hasActiveFilters
              ? 'var(--arkiv-orange)'
              : 'var(--arkiv-ink)',
            opacity: hasActiveFilters ? 1 : 0.4,
          }}
        >
          Clear filters
        </button>
      </div>

      {/* Job list */}
      <div className={isPending ? 'opacity-50 transition-opacity' : ''}>
        <JobList jobs={filtered} />
      </div>

      {/* Load more */}
      {!isPending && jobs.length >= limit && (
        <div className="flex justify-center pt-2">
          <button
            onClick={() => {
              const nextLimit = FETCH_LIMITS.find((l) => l > limit) ?? limit;
              updateParams({ limit: String(nextLimit) });
            }}
            className="text-sm font-medium px-6 py-2.5 rounded-lg border transition-opacity hover:opacity-80"
            style={{
              borderColor: 'var(--arkiv-blue)',
              color: 'var(--arkiv-blue)',
            }}
          >
            Load more
          </button>
        </div>
      )}
    </div>
  );
}
