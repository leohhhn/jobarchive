import { arkivPublicClient } from './arkiv-client';
import { JobPosting } from './types';

export async function getJob(id: string): Promise<JobPosting | null> {
  try {
    const entity = await arkivPublicClient.getEntity(id as `0x${string}`);
    if (!entity) return null;

    const attrs = Object.fromEntries(
      (entity.attributes ?? []).map((a) => [a.key, a.value]),
    );
    const payload = entity.toJson();

    return {
      id: entity.key,
      title: payload.title,
      company: payload.company,
      description: payload.description,
      compensation: payload.compensation ?? undefined,
      author: payload.author,
      category: attrs.category as string,
      location: attrs.location as string,
      remote: attrs.remote === 'true',
      stack: (attrs.stack as string)?.split(',').filter(Boolean) ?? [],
      postedAt: Number(attrs.postedAt),
      expiresAt: Number(attrs.expiresAt),
    };
  } catch (err) {
    console.error(`Failed to fetch job ${id}:`, err);
    return null;
  }
}
