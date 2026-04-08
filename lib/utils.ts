import { Currency, JobPosting } from './types';

interface BlockTiming {
  currentBlock: bigint | number;
  currentBlockTime: bigint | number;
  blockDuration: bigint | number;
}

interface ArkivEntity {
  key: string;
  expiresAtBlock: bigint | number | undefined;
  attributes?: { key: string; value: string | number }[];
  toJson: () => Record<string, string>;
}

/** Returns days remaining until expiry, clamped to 0 for already-expired listings. */
export function daysUntilExpiry(expiresAt: number): number {
  return Math.max(0, Math.ceil((expiresAt - Date.now()) / (1000 * 60 * 60 * 24)));
}

/**
 * Converts a raw Arkiv entity into a JobPosting.
 *
 * Expiration on Arkiv is block-based, not timestamp-based. We convert it to a
 * Unix ms timestamp by extrapolating from the current block and block duration:
 *   expiresAt = (currentBlockTime + (expiresAtBlock - currentBlock) * blockDuration) * 1000
 */
export function parseJobEntity(
  entity: ArkivEntity,
  timing: BlockTiming,
): JobPosting {
  const attrs = Object.fromEntries(
    (entity.attributes ?? []).map((a) => [a.key, a.value]),
  );
  const payload = entity.toJson();

  const currentBlock = Number(timing.currentBlock);
  const currentBlockTime = Number(timing.currentBlockTime);
  const blockDuration = Number(timing.blockDuration);
  const expiresAt =
    (currentBlockTime +
      (Number(entity.expiresAtBlock ?? 0) - currentBlock) * blockDuration) *
    1000;

  return {
    id: entity.key,
    title: payload.title,
    company: payload.company,
    description: payload.description,
    author: payload.author,
    category: attrs.category as string,
    location: attrs.location as string,
    remote: attrs.remote === 'true',
    stack: (attrs.stack as string)?.split(',').filter(Boolean) ?? [],
    postedAt: Number(attrs.postedAt),
    expiresAt,
    compMin: attrs.compMin !== undefined ? Number(attrs.compMin) : undefined,
    compMax: attrs.compMax !== undefined ? Number(attrs.compMax) : undefined,
    compCurrency: attrs.compCurrency as Currency | undefined,
    applyUrl: payload.applyUrl,
  };
}

/** Formats a raw dollar value as a human-readable string (e.g. 150000 → "150k", 1500000 → "1.5m"). */
function formatCompValue(value: number): string {
  if (value >= 1_000_000) {
    const m = value / 1_000_000;
    return `${m < 10 ? m.toFixed(1) : Math.floor(m)}m`;
  }

  const k = Math.floor(value / 1000);
  return `${k}k`;
}

/** Returns a formatted compensation label (e.g. "USD 100k – 150k"), or null if no comp data. */
export function formatCompLabel(
  job: Pick<JobPosting, 'compMin' | 'compMax' | 'compCurrency'>,
): string | null {
  const { compMin, compMax, compCurrency } = job;
  if (!compMin && !compMax) return null;

  const currency = compCurrency ?? '';
  if (compMin && compMax)
    return `${currency} ${formatCompValue(compMin)} – ${formatCompValue(compMax)}`;
  if (compMin) return `${currency} ${formatCompValue(compMin)}+`;
  return `${currency} Up to ${formatCompValue(compMax!)}`;
}
