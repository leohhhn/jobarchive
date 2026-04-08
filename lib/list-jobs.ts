import { JobPosting, PROJECT_ATTRIBUTE, DEFAULT_FETCH_LIMIT } from './types';
import { arkivPublicClient } from './arkiv-client';
import { parseJobEntity } from './utils';
import { eq } from '@arkiv-network/sdk/query';

export interface JobFilters {
  remote?: boolean;
  category?: string;
}

export async function getJobs(
  filters: JobFilters = {},
  limit: number = DEFAULT_FETCH_LIMIT,
): Promise<JobPosting[]> {
  const query = arkivPublicClient
    .buildQuery()
    .where([
      eq('type', 'job'),
      eq(PROJECT_ATTRIBUTE.key, PROJECT_ATTRIBUTE.value),
    ])
    .withAttributes(true)
    .withPayload(true)
    .withMetadata(true)
    .limit(limit);

  if (filters.remote !== undefined) {
    query.where(eq('remote', filters.remote ? 'true' : 'false'));
  }

  if (filters.category) {
    query.where(eq('category', filters.category));
  }

  const [results, timing] = await Promise.all([
    query.fetch(),
    arkivPublicClient.getBlockTiming(),
  ]);

  return results.entities
    .map((entity) => parseJobEntity(entity, timing))
    .sort((a, b) => b.postedAt - a.postedAt);
}

/** Fetches all job listings owned by the given wallet address using Arkiv's ownedBy query. */
export async function getMyJobs(address: string): Promise<JobPosting[]> {
  const query = arkivPublicClient
    .buildQuery()
    .where([
      eq('type', 'job'),
      eq(PROJECT_ATTRIBUTE.key, PROJECT_ATTRIBUTE.value),
    ])
    .withAttributes(true)
    .withPayload(true)
    .withMetadata(true)
    .ownedBy(address as `0x${string}`)
    .limit(50);

  const [results, timing] = await Promise.all([
    query.fetch(),
    arkivPublicClient.getBlockTiming(),
  ]);

  return results.entities
    .map((entity) => parseJobEntity(entity, timing))
    .sort((a, b) => b.postedAt - a.postedAt);
}
