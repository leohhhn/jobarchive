import { createWalletClient, custom } from 'viem';
import { createWalletClient as createArkivClient } from '@arkiv-network/sdk';
import { kaolin } from '@arkiv-network/sdk/chains';

// get wallet from browser
const viemWallet = createWalletClient({
  chain: kaolin,
  transport: custom(window.ethereum),
});

// give wallet to arkiv
const arkivClient = createArkivClient({
  chain: kaolin,
  transport: custom(window.ethereum),
  account: viemWallet.account,
});
