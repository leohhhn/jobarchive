'use client';

import Link from 'next/link';
import { useArkiv } from '@/hooks/useArkiv';

export default function Navbar() {
  const { account, isConnected, connect, disconnect } = useArkiv();

  return (
    <nav className="border-b border-gray-200 bg-white px-6 py-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div>
          <Link href="/">
            <span className="font-bold text-gray-900 text-lg">Web3 Jobs</span>
          </Link>
          <span className="ml-2 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
            powered by Arkiv
          </span>
        </div>

        <div className="flex items-center gap-3">
          {isConnected ? (
            <>
              <span className="text-sm text-gray-500">
                {account?.slice(0, 6)}...{account?.slice(-4)}
              </span>
              <button
                onClick={disconnect}
                className="text-sm text-gray-500 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Disconnect
              </button>
              <Link
                href="/new"
                className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
              >
                Post a Job
              </Link>
            </>
          ) : (
            <button
              onClick={connect}
              className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
