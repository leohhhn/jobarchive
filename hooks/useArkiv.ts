'use client';

import { useState } from 'react';
import {
  createWalletClient,
  createPublicClient,
  custom,
  http,
} from '@arkiv-network/sdk';
import { kaolin } from '@arkiv-network/sdk/chains';

export function useArkiv() {
  const [walletClient, setWalletClient] = useState<any>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const publicClient = createPublicClient({
    chain: kaolin,
    transport: http(),
  });

  const connect = async () => {
    if (typeof window.ethereum === 'undefined') {
      alert('Please install MetaMask!');
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      const client = createWalletClient({
        chain: kaolin,
        transport: custom(window.ethereum),
      });

      setWalletClient(client);
      setAccount(accounts[0]);
      setIsConnected(true);
    } catch (error) {
      console.error('Failed to connect:', error);
    }
  };

  const disconnect = () => {
    setWalletClient(null);
    setAccount(null);
    setIsConnected(false);
  };

  return {
    walletClient,
    publicClient,
    account,
    isConnected,
    connect,
    disconnect,
  };
}
