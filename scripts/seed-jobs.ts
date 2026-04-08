import { createWalletClient, http } from '@arkiv-network/sdk';
import { privateKeyToAccount } from '@arkiv-network/sdk/accounts';
import { kaolin } from '@arkiv-network/sdk/chains';
import { ExpirationTime, jsonToPayload } from '@arkiv-network/sdk/utils';
import * as dotenv from 'dotenv';
import { PROJECT_ATTRIBUTE } from '../lib/types';

dotenv.config({ path: '../.env.local' });

// This is a simple script with some mock data for dev purposes

const JOBS = [
  {
    title: 'Senior Solidity Engineer',
    company: 'Uniswap Labs',
    location: 'New York, USA',
    remote: false,
    category: 'Engineering',
    stack: ['Solidity', 'TypeScript', 'Hardhat', 'Foundry'],
    description:
      'Join the team building the most widely used DEX protocol. You will design and implement smart contracts for the next generation of Uniswap, work closely with security researchers, and contribute to open-source tooling used across the ecosystem.',
    compMin: 160000,
    compMax: 220000,
    compCurrency: 'USD',
    expiryDays: 30,
    applyUrl: 'https://boards.greenhouse.io/uniswaplabs',
  },
  {
    title: 'Developer Relations Engineer',
    company: 'Golem Network',
    location: 'Remote',
    remote: true,
    category: 'DevRel',
    stack: ['TypeScript', 'Go', 'Ethereum', 'Node.js'],
    description:
      'Help developers build on the Golem Network by creating tutorials, maintaining documentation, and engaging with the community. You will run workshops, respond to developer questions, and bridge the gap between product and the builder ecosystem.',
    compMin: 90000,
    compMax: 130000,
    compCurrency: 'USD',
    expiryDays: 14,
    applyUrl: 'https://golem.network/careers',
  },
  {
    title: 'Protocol Researcher',
    company: 'Ethereum Foundation',
    location: 'Berlin, Germany',
    remote: true,
    category: 'Research',
    stack: ['Python', 'Cryptography', 'Game Theory', 'Rust'],
    description:
      'Conduct research on consensus mechanisms, cryptographic protocols, and economic incentive design. Publish findings, collaborate with external researchers, and contribute directly to Ethereum improvement proposals.',
    compMin: 120000,
    compMax: 160000,
    compCurrency: 'EUR',
    expiryDays: 60,
    applyUrl: 'https://ethereum.org/en/community/grants/',
  },
  {
    title: 'Frontend Engineer',
    company: 'Aave',
    location: 'London, UK',
    remote: false,
    category: 'Engineering',
    stack: ['React', 'TypeScript', 'Wagmi', 'Viem'],
    description:
      'Build and maintain the Aave web interface used by millions of users. You will work on performance, accessibility, and new feature development, collaborating closely with smart contract engineers and designers.',
    compMin: 100000,
    compMax: 140000,
    compCurrency: 'GBP',
    expiryDays: 30,
    applyUrl: 'https://aave.com/careers',
  },
  {
    title: 'Go Backend Engineer',
    company: 'Chainlink Labs',
    location: 'Remote',
    remote: true,
    category: 'Engineering',
    stack: ['Go', 'PostgreSQL', 'Kubernetes', 'gRPC'],
    description:
      'Work on the infrastructure powering Chainlink oracle networks. Design and implement high-availability backend services, contribute to the node software, and ensure the reliability of data feeds used across thousands of protocols.',
    compMin: 150000,
    compMax: 200000,
    compCurrency: 'USD',
    expiryDays: 30,
    applyUrl: 'https://chainlinklabs.com/careers',
  },
  {
    title: 'Product Designer',
    company: 'MetaMask',
    location: 'Remote',
    remote: true,
    category: 'Design',
    stack: ['Figma', 'Prototyping', 'User Research'],
    description:
      'Shape the experience of the most widely used crypto wallet. You will lead design for new features, conduct user research, and work with engineers to ship polished, accessible interfaces to millions of users globally.',
    compMin: 110000,
    compMax: 150000,
    compCurrency: 'USD',
    expiryDays: 45,
    applyUrl: 'https://consensys.io/open-roles',
  },
  {
    title: 'Rust Systems Engineer',
    company: 'Solana Foundation',
    location: 'Austin, USA',
    remote: false,
    category: 'Engineering',
    stack: ['Rust', 'C++', 'Linux', 'Networking'],
    description:
      'Contribute to the Solana validator client and core runtime. You will work on performance-critical code paths, optimize transaction processing, and help scale the network to handle more throughput.',
    compMin: 180000,
    compMax: 250000,
    compCurrency: 'USD',
    expiryDays: 30,
    applyUrl: 'https://solana.com/community/jobs',
  },
  {
    title: 'Technical Writer',
    company: 'Polygon',
    location: 'Remote',
    remote: true,
    category: 'DevRel',
    stack: ['Markdown', 'Solidity', 'TypeScript', 'Git'],
    description:
      'Create and maintain developer documentation for Polygon zkEVM and PoS. Work with engineers to document new features, write tutorials, and improve the overall developer onboarding experience.',
    compMin: 70000,
    compMax: 100000,
    compCurrency: 'USD',
    expiryDays: 30,
    applyUrl: 'https://polygon.technology/careers',
  },
  {
    title: 'ZK Cryptography Engineer',
    company: 'StarkWare',
    location: 'Tel Aviv, Israel',
    remote: false,
    category: 'Research',
    stack: ['Rust', 'Python', 'STARKs', 'Cairo'],
    description:
      'Design and implement zero-knowledge proof systems for StarkWare products. You will work on circuit design, proof generation optimization, and contribute to the Cairo language and STARK ecosystem.',
    compMin: 200000,
    compMax: 300000,
    compCurrency: 'USD',
    expiryDays: 60,
    applyUrl: 'https://starkware.co/career/',
  },
  {
    title: 'Product Manager',
    company: 'Arbitrum',
    location: 'New York, USA',
    remote: true,
    category: 'Product',
    stack: ['Product Strategy', 'Ethereum', 'Agile'],
    description:
      'Drive the roadmap for Arbitrum developer tooling and ecosystem products. Work across engineering, research, and BD to define and ship features that help developers build on Arbitrum.',
    compMin: 140000,
    compMax: 180000,
    compCurrency: 'USD',
    expiryDays: 30,
    applyUrl: 'https://jobs.lever.co/arbitrum',
  },
  {
    title: 'Smart Contract Auditor',
    company: 'OpenZeppelin',
    location: 'Remote',
    remote: true,
    category: 'Engineering',
    stack: ['Solidity', 'Vyper', 'Foundry', 'Security'],
    description:
      'Audit smart contracts for leading DeFi and NFT protocols. Review code for vulnerabilities, write detailed audit reports, and advise clients on security best practices and remediation strategies.',
    compMin: 130000,
    compMax: 180000,
    compCurrency: 'USD',
    expiryDays: 14,
    applyUrl: 'https://openzeppelin.com/jobs',
  },
  {
    title: 'DevRel Lead',
    company: 'Alchemy',
    location: 'San Francisco, USA',
    remote: false,
    category: 'DevRel',
    stack: ['TypeScript', 'Ethereum', 'Public Speaking', 'Community'],
    description:
      "Lead developer relations for Alchemy's platform, managing a team of DevRel engineers. Define the strategy for developer education, community growth, and ecosystem partnerships.",
    compMin: 160000,
    compMax: 210000,
    compCurrency: 'USD',
    expiryDays: 30,
    applyUrl: 'https://jobs.ashbyhq.com/alchemy',
  },
];

async function main() {
  const privateKey = process.env.ARKIV_PRIVATE_KEY;
  if (!privateKey) {
    throw new Error('ARKIV_PRIVATE_KEY not set in .env.local');
  }

  const account = privateKeyToAccount(privateKey as `0x${string}`);
  const walletClient = createWalletClient({
    chain: kaolin,
    transport: http(),
    account,
  });

  console.log(
    `Seeding ${JOBS.length} jobs in a single batch from ${account.address}...\n`,
  );

  const now = Date.now();

  const creates = JOBS.map((job) => {
    const postedAt = now;
    const expiresAt = postedAt + job.expiryDays * 24 * 60 * 60 * 1000;

    return {
      payload: jsonToPayload({
        title: job.title,
        company: job.company,
        description: job.description,
        author: account.address,
        applyUrl: job.applyUrl,
      }),
      contentType: 'application/json',
      attributes: [
        PROJECT_ATTRIBUTE,
        { key: 'type', value: 'job' },
        { key: 'category', value: job.category },
        { key: 'company', value: job.company },
        { key: 'location', value: job.location },
        { key: 'remote', value: job.remote ? 'true' : 'false' },
        { key: 'stack', value: job.stack.join(',') },
        { key: 'postedAt', value: postedAt },
        { key: 'expiresAt', value: expiresAt },
        { key: 'compMin', value: job.compMin },
        { key: 'compMax', value: job.compMax },
        { key: 'compCurrency', value: job.compCurrency },
      ],
      expiresIn: ExpirationTime.fromDays(job.expiryDays),
    };
  });

  try {
    const results = await walletClient.mutateEntities({ creates });
    console.log(`Done! ${JOBS.length} jobs seeded in one transaction.`);
    results.createdEntities.forEach((entity, idx) => {
      console.log(`- ${JOBS[idx].title} at ${JOBS[idx].company}`);
    });
  } catch (err) {
    console.error('Batch failed:', err);
  }
}

main().catch(console.error);
