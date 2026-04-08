import { ExpirationTime, jsonToPayload } from '@arkiv-network/sdk/utils';
import { JobPosting, PROJECT_ATTRIBUTE } from './types';
import { daysUntilExpiry } from './utils';
import type { Connector } from 'wagmi';
import { kaolin } from '@arkiv-network/sdk/chains';
import {
  EIP1193Provider,
  createWalletClient,
  custom,
} from '@arkiv-network/sdk';

/**
 * Creates a new job posting on Arkiv. The job will be
 * associated with the provided Ethereum address, which will be the author of the job posting.
 */

export async function createJob(
  connector: Connector,
  address: `0x${string}`,
  job: Omit<JobPosting, 'id' | 'author'>,
): Promise<{ entityKey: string; txHash: string }> {
  const provider = (await connector.getProvider()) as EIP1193Provider;

  const walletClient = createWalletClient({
    chain: kaolin,
    transport: custom(provider),
    account: address,
  });

  const { entityKey, txHash } = await walletClient.createEntity({
    payload: jsonToPayload({
      title: job.title,
      company: job.company,
      location: job.location,
      stack: job.stack,
      description: job.description,
      author: address,
      applyUrl: job.applyUrl,
    }),
    contentType: 'application/json',
    attributes: [
      PROJECT_ATTRIBUTE,
      { key: 'type', value: 'job' },
      { key: 'category', value: job.category },
      { key: 'remote', value: job.remote ? 'true' : 'false' },
      { key: 'postedAt', value: Date.now() },
      ...(job.compMin !== undefined
        ? [{ key: 'compMin', value: job.compMin }]
        : []),
      ...(job.compMax !== undefined
        ? [{ key: 'compMax', value: job.compMax }]
        : []),
      ...(job.compCurrency
        ? [{ key: 'compCurrency', value: job.compCurrency }]
        : []),
    ],
    expiresIn: ExpirationTime.fromDays(daysUntilExpiry(job.expiresAt)),
  });

  return { entityKey, txHash };
}
