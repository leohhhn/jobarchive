import { eq } from '@arkiv-network/sdk/query';

import { JobPosting, PROJECT_ATTRIBUTE } from './types';
import { arkivPublicClient } from './arkiv-client';

export async function getJobs(): Promise<JobPosting[]> {
  const results = await arkivPublicClient
    .buildQuery()
    .where([
      eq('type', 'job'),
      eq(PROJECT_ATTRIBUTE.key, PROJECT_ATTRIBUTE.value),
    ])
    .withAttributes(true)
    .withPayload(true)
    .withMetadata(true)
    .limit(50)
    .fetch();

  return results.entities.map((entity) => {
    const attrs = Object.fromEntries(
      entity.attributes?.map((a) => [a.key, a.value]) ?? [],
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
      stack: (attrs.stack as string)?.split(',') ?? [],
      postedAt: Number(attrs.postedAt),
      expiresAt: Number(attrs.expiresAt),
    };
  });
}
