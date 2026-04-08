'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAccount } from 'wagmi';
import { createJob } from '../lib/create-job';
import { revalidateAndRedirectHome } from '../app/actions';
import { useIsMounted } from '../hooks/useIsMounted';
import {
  CURRENCIES,
  Currency,
  EXPIRY_OPTIONS,
  JOB_CATEGORIES,
} from '../lib/types';

export default function JobForm() {
  const { connector, address, isConnected, isConnecting, isReconnecting } =
    useAccount();
  const mounted = useIsMounted();

  const walletLoading = !mounted() || isConnecting || isReconnecting;

  const [txHash, setTxHash] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: '',
    company: '',
    location: '',
    remote: false,
    category: '',
    stack: '',
    description: '',
    compMin: '',
    compMax: '',
    compCurrency: 'USD' as Currency,
    expiryDays: 30 as number,
    customExpiry: false,
    applyUrl: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit =
    isConnected &&
    form.title.trim() &&
    form.company.trim() &&
    form.description.trim() &&
    !loading;

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

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canSubmit || !connector || !address) return;

    setLoading(true);
    setError(null);
    try {
      const { entityKey, txHash } = await createJob(connector, address, {
        title: form.title.trim(),
        company: form.company.trim(),
        location: form.location.trim(),
        remote: form.remote,
        category: form.category.trim(),
        stack: form.stack
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        description: form.description.trim(),
        compMin: form.compMin ? Number(form.compMin) : undefined,
        compMax: form.compMax ? Number(form.compMax) : undefined,
        compCurrency: form.compCurrency,
        postedAt: Date.now(),
        applyUrl: form.applyUrl.trim(),
        expiresAt: Date.now() + form.expiryDays * 24 * 60 * 60 * 1000,
      });
      setTxHash(txHash);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to post job');
    } finally {
      setLoading(false);
    }
  }

  if (txHash) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Post a Job</h2>
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
            ← Back
          </Link>
        </div>
        <div className="rounded-lg bg-green-50 border border-green-200 px-6 py-5 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <p className="font-medium text-green-800">
              Job posted successfully!
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-xs text-green-700 font-medium">
              Transaction hash
            </p>
            <p className="font-mono text-xs break-all text-green-800 bg-green-100 px-3 py-2 rounded-lg">
              {txHash}
            </p>
          </div>
          <a
            href={`https://explorer.kaolin.hoodi.arkiv.network/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-green-700 underline hover:text-green-900"
          >
            View on Kaolin Explorer →
          </a>
          <button
            onClick={() => revalidateAndRedirectHome()}
            className="mt-1 w-full py-2.5 rounded-lg bg-purple-600 text-white text-sm
                     font-medium hover:bg-purple-700 transition-colors"
          >
            Back to listings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Post a Job</h2>
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
          ← Back
        </Link>
      </div>

      {!walletLoading && !isConnected && (
        <div className="rounded-lg bg-yellow-50 border border-yellow-200 px-4 py-3 text-sm text-yellow-800">
          Please connect your wallet to post a job.
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Job title" htmlFor="title">
          <input
            id="title"
            name="title"
            type="text"
            placeholder="e.g. Solidity Engineer"
            className={input()}
            value={form.title}
            onChange={handleChange}
            disabled={loading}
          />
        </Field>
        <Field label="Company" htmlFor="company">
          <input
            id="company"
            name="company"
            type="text"
            placeholder="e.g. Acme Labs"
            className={input()}
            value={form.company}
            onChange={handleChange}
            disabled={loading}
          />
        </Field>
        <Field label="Location" htmlFor="location">
          <input
            id="location"
            name="location"
            type="text"
            placeholder="e.g. Berlin, Worldwide"
            className={input()}
            value={form.location}
            onChange={handleChange}
            disabled={loading}
          />
        </Field>
        <Field label="Listing duration" htmlFor="expiryDays">
          <div className="flex gap-2">
            <select
              className={input(form.customExpiry ? 'w-auto' : 'w-full')}
              value={form.customExpiry ? 'custom' : form.expiryDays}
              onChange={(e) => {
                if (e.target.value === 'custom') {
                  setForm((prev) => ({ ...prev, customExpiry: true }));
                } else {
                  setForm((prev) => ({
                    ...prev,
                    expiryDays: Number(e.target.value),
                    customExpiry: false,
                  }));
                }
              }}
              disabled={loading}
            >
              {EXPIRY_OPTIONS.map(({ label, days }) => (
                <option key={days} value={days}>
                  {label}
                </option>
              ))}
              <option value="custom">Custom...</option>
            </select>

            {form.customExpiry && (
              <div className="flex items-center gap-2 flex-1">
                <input
                  id="expiryDays"
                  type="number"
                  min={1}
                  max={365}
                  placeholder="e.g. 45"
                  className={input()}
                  style={{ width: '120px' }}
                  value={form.expiryDays === 30 ? '' : form.expiryDays}
                  onChange={(e) => {
                    const val = Math.max(
                      1,
                      Math.min(365, Number(e.target.value)),
                    );
                    setForm((prev) => ({ ...prev, expiryDays: val }));
                  }}
                  disabled={loading}
                  autoFocus
                />
                <span className="text-sm text-gray-500 whitespace-nowrap">
                  days
                </span>
              </div>
            )}
          </div>
        </Field>

        <Field label="Application link" htmlFor="applyUrl">
          <input
            id="applyUrl"
            name="applyUrl"
            type="url"
            placeholder="e.g. https://jobs.company.com/apply"
            className={input()}
            value={form.applyUrl}
            onChange={handleChange}
            disabled={loading}
          />
        </Field>
        <label className="flex items-center gap-3 text-sm text-gray-600 cursor-pointer">
          <input
            type="checkbox"
            name="remote"
            checked={form.remote}
            onChange={handleChange}
            className="w-4 h-4 accent-purple-600"
          />
          This is a remote/hybrid position
        </label>
        <Field label="Category" htmlFor="category">
          <input
            id="category"
            name="category"
            type="text"
            list="category-suggestions"
            placeholder="e.g. Engineering, DevRel"
            className={input()}
            value={form.category}
            onChange={handleChange}
            disabled={loading}
          />
          <datalist id="category-suggestions">
            {JOB_CATEGORIES.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </Field>
        <Field label="Stack" htmlFor="stack">
          <input
            id="stack"
            name="stack"
            type="text"
            placeholder="e.g. Rust, Go, Solidity (comma separated)"
            className={input()}
            value={form.stack}
            onChange={handleChange}
            disabled={loading}
          />
        </Field>
        <Field label="Compensation" htmlFor="compMin">
          <div className="flex gap-2 items-center">
            <select
              name="compCurrency"
              value={form.compCurrency}
              onChange={handleChange}
              className={input('w-24 shrink-0')}
              disabled={loading}
            >
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <input
              id="compMin"
              name="compMin"
              type="number"
              min={0}
              placeholder="Min"
              className={input()}
              style={{ width: '120px', flexShrink: 0 }}
              value={form.compMin}
              onChange={handleChange}
              disabled={loading}
            />
            <span className="text-sm text-gray-400 shrink-0">–</span>
            <input
              name="compMax"
              type="number"
              min={0}
              placeholder="Max"
              className={input()}
              style={{ width: '120px', flexShrink: 0 }}
              value={form.compMax}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Leave blank if not specified
          </p>
        </Field>
        <Field label="Description" htmlFor="description">
          <textarea
            id="description"
            name="description"
            placeholder="Role overview, responsibilities..."
            className={input('h-32 resize-none')}
            value={form.description}
            onChange={handleChange}
            disabled={loading}
          />
        </Field>
        <button
          type="submit"
          disabled={!canSubmit}
          className="w-full py-2.5 rounded-lg bg-purple-600 text-white text-sm font-medium
                     hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed
                     transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <svg
              className="animate-spin h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              />
            </svg>
          ) : (
            'Post Job'
          )}
        </button>
      </form>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      {children}
    </div>
  );
}

const input = (extra = '') =>
  `w-full px-3 py-2 rounded-lg border border-gray-300 text-sm bg-white
   focus:outline-none focus:ring-2 focus:ring-purple-400
   disabled:opacity-50 disabled:cursor-not-allowed ${extra}`;
