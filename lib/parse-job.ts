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
