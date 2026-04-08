import {
  createPublicClient,
  http,
  type PublicClient,
} from '@arkiv-network/sdk';
import { kaolin } from '@arkiv-network/sdk/chains';

export type { PublicClient };

export const arkivPublicClient = createPublicClient({
  chain: kaolin,
  transport: http(),
});
