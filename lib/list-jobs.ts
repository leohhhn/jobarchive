import { Currency, JobPosting, PROJECT_ATTRIBUTE } from './types';
import { arkivPublicClient } from './arkiv-client';

import { eq } from '@arkiv-network/sdk/query';

export interface JobFilters {
  remote?: boolean;
  category?: string;
}

export async function getJobs(filters: JobFilters = {}): Promise<JobPosting[]> {
  const query = arkivPublicClient
    .buildQuery()
    .where([
      eq('type', 'job'),
      eq(PROJECT_ATTRIBUTE.key, PROJECT_ATTRIBUTE.value),
    ])
    .withAttributes(true)
    .withPayload(true)
    .withMetadata(true)
    .limit(50);

  if (filters.remote !== undefined) {
    query.where(eq('remote', filters.remote ? 'true' : 'false'));
  }

  if (filters.category) {
    query.where(eq('category', filters.category));
  }

  const results = await query.fetch();

  return results.entities
    .map((entity) => {
      const attrs = Object.fromEntries(
        (entity.attributes ?? []).map((a) => [a.key, a.value]),
      );
      const payload = entity.toJson();

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
        expiresAt: Number(attrs.expiresAt),
        compMin:
          attrs.compMin !== undefined ? Number(attrs.compMin) : undefined,
        compMax:
          attrs.compMax !== undefined ? Number(attrs.compMax) : undefined,
        compCurrency: attrs.compCurrency as Currency | undefined,
      };
    })
    .sort((a, b) => b.postedAt - a.postedAt);
}
