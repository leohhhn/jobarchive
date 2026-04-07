import {
  createWalletClient,
  createPublicClient,
  http,
  custom,
  type WalletClient,
  type PublicClient,
  PublicArkivClient,
} from '@arkiv-network/sdk';
import { privateKeyToAccount } from '@arkiv-network/sdk/accounts';
import { kaolin } from '@arkiv-network/sdk/chains';

// ---- types ----
export type { WalletClient, PublicClient };

// ---- server-side client (private key) ----
export function createServerWalletClient() {
  const account = privateKeyToAccount(
    process.env.ARKIV_PRIVATE_KEY as `0x${string}`,
  );
  return createWalletClient({
    chain: kaolin,
    transport: http(),
    account,
  });
}

// ---- browser client (MetaMask) ----
export function createBrowserWalletClient() {
  return createWalletClient({
    chain: kaolin,
    transport: custom(window.ethereum),
  });
}

// ---- public read-only client ----
export const arkivPublicClient = createPublicClient({
  chain: kaolin,
  transport: http(),
});
