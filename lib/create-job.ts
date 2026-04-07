import { ExpirationTime, jsonToPayload } from '@arkiv-network/sdk/utils';
import { JobPosting, PROJECT_ATTRIBUTE } from './types';
import type { Connector } from 'wagmi';
import { kaolin } from '@arkiv-network/sdk/chains';
import {
  EIP1193Provider,
  createWalletClient,
  custom,
} from '@arkiv-network/sdk';

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
      description: job.description,
      compensation: job.compensation ?? null,
      author: address,
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
      { key: 'expiresAt', value: job.expiresAt },
    ],
    expiresIn: ExpirationTime.fromDays(
      Math.ceil((job.expiresAt - Date.now()) / (1000 * 60 * 60 * 24)),
    ),
  });

  return { entityKey, txHash };
}
