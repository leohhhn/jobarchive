import { kaolin } from '@arkiv-network/sdk/chains';
import { ExpirationTime } from '@arkiv-network/sdk/utils';
import { Connector } from 'wagmi';
import {
  EIP1193Provider,
  createWalletClient,
  custom,
} from '@arkiv-network/sdk';

export async function extendJob(
  connector: Connector,
  address: `0x${string}`,
  entityKey: string,
  days: number,
): Promise<void> {
  const provider = (await connector.getProvider()) as EIP1193Provider;

  const walletClient = createWalletClient({
    chain: kaolin,
    transport: custom(provider),
    account: address,
  });

  await walletClient.extendEntity({
    entityKey: entityKey as `0x${string}`,
    expiresIn: ExpirationTime.fromDays(days),
  });
}

export async function deleteJob(
  connector: Connector,
  address: `0x${string}`,
  entityKey: string,
): Promise<void> {
  const provider = (await connector.getProvider()) as EIP1193Provider;
  const walletClient = createWalletClient({
    chain: kaolin,
    transport: custom(provider),
    account: address,
  });

  await walletClient.deleteEntity({
    entityKey: entityKey as `0x${string}`,
  });
}
