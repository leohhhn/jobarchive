'use client';

import Link from 'next/link';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useIsMounted } from '@/hooks/useIsMounted';

export default function Navbar() {
  const { isConnected } = useAccount();
  const mounted = useIsMounted();

  return (
    <nav
      style={{
        borderBottom: '1px solid var(--arkiv-stone)',
        backgroundColor: 'white',
      }}
      className="px-6 py-4"
    >
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Link href="/">
            <span
              style={{ color: 'var(--arkiv-blue)' }}
              className="font-bold text-lg tracking-tight"
            >
              [ JOBARCHIVE ]
            </span>
          </Link>
          <span
            style={{
              backgroundColor: '#FE744620',
              color: 'var(--arkiv-orange)',
              border: '1px solid #FE744640',
            }}
            className="text-xs px-2 py-0.5 rounded-full font-medium"
          >
            powered by Arkiv
          </span>
        </div>

        <div className="flex items-center gap-3">
          {mounted() && isConnected && (
            <Link
              href="/new"
              style={{ backgroundColor: 'var(--arkiv-orange)' }}
              className="text-white text-sm font-medium px-4 py-2 rounded-lg transition-opacity hover:opacity-90"
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
