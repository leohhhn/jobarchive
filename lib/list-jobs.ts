import { JobPosting, PROJECT_ATTRIBUTE, DEFAULT_FETCH_LIMIT } from './types';
import { arkivPublicClient } from './arkiv-client';
import { parseJobEntity } from './utils';
import { eq, lte, gte } from '@arkiv-network/sdk/query';

export interface JobFilters {
  remote?: boolean;
  category?: string;
  minComp?: number;
  maxComp?: number;
}

/** Fetches all job listings from Arkiv with a limit to the number of results returned. */
export async function getJobs(
  filters: JobFilters = {},
  limit: number = DEFAULT_FETCH_LIMIT,
): Promise<JobPosting[]> {
  const conditions = [
    eq('type', 'job'),
    eq(PROJECT_ATTRIBUTE.key, PROJECT_ATTRIBUTE.value),
  ];

  if (filters.remote !== undefined) {
    conditions.push(eq('remote', filters.remote ? 'true' : 'false'));
  }

  if (filters.category) {
    conditions.push(eq('category', filters.category));
  }

  if (filters.minComp !== undefined) {
    conditions.push(gte('compMax', filters.minComp));
  }

  if (filters.maxComp !== undefined) {
    conditions.push(lte('compMin', filters.maxComp));
  }

  const query = arkivPublicClient
    .buildQuery()
    .where(conditions)
    .withAttributes(true)
    .withPayload(true)
    .withMetadata(true)
    .limit(limit);

  const [results, timing] = await Promise.all([
    query.fetch(),
    arkivPublicClient.getBlockTiming(),
  ]);

  return results.entities
    .map((entity) => parseJobEntity(entity, timing))
    .sort((a, b) => b.postedAt - a.postedAt); // sort by newest
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
