import { arkivPublicClient } from './arkiv-client';
import { JobPosting } from './types';
import { parseJobEntity } from './utils';

/**
 * Fetches a job posting from Arkiv by its entity ID and parses it into the proper format.
 */
export async function getJob(id: string): Promise<JobPosting | null> {
  try {
    const [entity, timing] = await Promise.all([
      arkivPublicClient.getEntity(id as `0x${string}`),
      arkivPublicClient.getBlockTiming(),
    ]);

    if (!entity) return null;

    return parseJobEntity(entity, timing);
  } catch (err) {
    console.error(`Failed to fetch job ${id}:`, err);
    return null;
  }
}
