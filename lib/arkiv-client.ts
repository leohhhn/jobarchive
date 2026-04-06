import { config } from 'dotenv';
config({ path: '.env.local' });

import {
  createWalletClient,
  createPublicClient,
  http,
} from '@arkiv-network/sdk';
import { privateKeyToAccount } from '@arkiv-network/sdk/accounts';
import { kaolin } from '@arkiv-network/sdk/chains';

const account = privateKeyToAccount(
  process.env.ARKIV_PRIVATE_KEY as `0x${string}`,
);

// readonly
export const publicClient = createPublicClient({
  chain: kaolin,
  transport: http(),
});

// write
export const walletClient = createWalletClient({
  chain: kaolin,
  transport: http(),
  account,
});
