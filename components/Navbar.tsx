'use client';

import Link from 'next/link';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useIsMounted } from '@/hooks/useIsMounted';

export default function Navbar() {
  const { isConnected } = useAccount();
  const mounted = useIsMounted();

  return (
    <nav className="border-b border-gray-200 bg-white px-6 py-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div>
          <Link href="/">
            <span className="font-bold text-gray-900 text-lg">Job Archive</span>
          </Link>
          <span className="ml-2 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
            powered by Arkiv
          </span>
        </div>

        <div className="flex items-center gap-3">
          {mounted() && isConnected && (
            <Link
              href="/new"
              className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              Post a Job
            </Link>
          )}
          <ConnectButton />
        </div>
      </div>
    </nav>
  );
}
