import { JobPosting } from './types';

export const mockJobs: JobPosting[] = [
  {
    id: '1',
    title: 'Developer Relations Engineer',
    company: 'Golem Network',
    location: 'Europe',
    remote: true,
    stack: ['typescript', 'go', 'ethereum'],
    category: 'devrel',
    description: 'Join us to help developers build on Golem Network...',
    compensation: '$120k - $150k',
    postedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    title: 'Smart Contract Engineer',
    company: 'Arkiv Network',
    location: 'Lisbon, Portugal',
    remote: false,
    stack: ['solidity', 'typescript', 'hardhat'],
    category: 'engineering',
    description:
      'Build the next generation of decentralized data infrastructure...',
    compensation: '$130k - $160k',
    postedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    title: 'Protocol Researcher',
    company: 'Ethereum Foundation',
    location: 'Belgrade, Serbia',
    remote: true,
    stack: ['python', 'rust', 'cryptography'],
    category: 'research',
    description: 'Research scalability solutions for Ethereum...',
    postedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
  },
];