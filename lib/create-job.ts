import { ExpirationTime, jsonToPayload } from '@arkiv-network/sdk/utils';
import { JobPosting, PROJECT_ATTRIBUTE } from './types';
import { type WalletClient } from '@arkiv-network/sdk';

export async function createJob(
  walletClient: WalletClient,
  job: Omit<JobPosting, 'id' | 'author'>,
): Promise<string> {
  const { entityKey } = await walletClient.createEntity({
    payload: jsonToPayload({
      title: job.title,
      company: job.company,
      description: job.description,
      compensation: job.compensation ?? null,
      author: walletClient.account?.address,
    }),
    contentType: 'application/json',
    attributes: [
      PROJECT_ATTRIBUTE,
      { key: 'type', value: 'job' },
      { key: 'category', value: job.category },
      { key: 'company', value: job.company },
      { key: 'location', value: job.location },
      { key: 'remote', value: job.remote ? 'true' : 'false' },
      { key: 'stack', value: job.stack.join(',') },
      { key: 'postedAt', value: Date.now() },
      { key: 'expiresAt', value: Date.now() + 30 * 24 * 60 * 60 * 1000 },
    ],
    expiresIn: ExpirationTime.fromDays(30),
  });

  return entityKey;
}

// ---- read ----
