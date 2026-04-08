import { arkivPublicClient } from './arkiv-client';
import { Currency, JobPosting } from './types';

export async function getJob(id: string): Promise<JobPosting | null> {
  try {
    const [entity, timing] = await Promise.all([
      arkivPublicClient.getEntity(id as `0x${string}`),
      arkivPublicClient.getBlockTiming(),
    ]);

    if (!entity) return null;

    const attrs = Object.fromEntries(
      (entity.attributes ?? []).map((a) => [a.key, a.value]),
    );
    const payload = entity.toJson();

    const currentBlock = Number(timing.currentBlock);
    const currentBlockTime = Number(timing.currentBlockTime);
    const blockDuration = Number(timing.blockDuration);
    const expiresAtBlock = Number(entity.expiresAtBlock);

    const expiresAt =
      (currentBlockTime + (expiresAtBlock - currentBlock) * blockDuration) *
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
  } catch (err) {
    console.error(`Failed to fetch job ${id}:`, err);
    return null;
  }
}
