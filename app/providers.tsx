'use client';

import { PROJECT_ATTRIBUTE } from '@/lib/types';
import { kaolin } from '@arkiv-network/sdk/chains';
import {
  Chain,
  getDefaultConfig,
  lightTheme,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { injectedWallet, metaMaskWallet } from '@rainbow-me/rainbowkit/wallets';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type React from 'react';
import { WagmiProvider } from 'wagmi';

export const config = getDefaultConfig({
  appName: 'JobsArchive',
  projectId: PROJECT_ATTRIBUTE.value,
  chains: [kaolin as unknown as Chain],
  ssr: true,
  wallets: (() => {
    return [
      {
        groupName: 'Recommended',
        wallets:
          typeof window === 'undefined'
            ? [injectedWallet]
            : // only initialize browser-specific wallets on the client side
              [injectedWallet, metaMaskWallet],
      },
    ];
  })(),
});

const queryClient = new QueryClient();

const rainbowKitTheme = {
  ...lightTheme({
    accentColor: 'var(--arkiv-blue)',
  }),
  fonts: {
    body: 'var(--default-font-family)',
  },
};

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={rainbowKitTheme}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
