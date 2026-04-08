import { createWalletClient, http } from '@arkiv-network/sdk';
import { privateKeyToAccount } from '@arkiv-network/sdk/accounts';
import { kaolin } from '@arkiv-network/sdk/chains';
import { ExpirationTime, jsonToPayload } from '@arkiv-network/sdk/utils';
import * as dotenv from 'dotenv';
import { PROJECT_ATTRIBUTE } from '../lib/types';
import { faker } from '@faker-js/faker';

dotenv.config({ path: '../.env.local' });

// This is a simple script with some mock data for dev purposes

type Job = {
  title: string;
  company: string;
  location: string;
  remote: boolean;
  category: string;
  stack: string[];
  description: string;
  compMin: number;
  compMax: number;
  compCurrency: string;
  expiryDays: number;
  applyUrl: string;
};

const TITLES = [
  'Frontend Engineer',
  'Backend Engineer',
  'Full Stack Engineer',
  'Smart Contract Engineer',
  'Protocol Engineer',
  'DevRel Engineer',
  'Product Manager',
  'Technical Writer',
  'Security Engineer',
  'Data Engineer',
];

const LEVELS = ['Junior', 'Mid', 'Senior', 'Staff'];

const STACKS = [
  ['TypeScript', 'React', 'Node.js'],
  ['Go', 'PostgreSQL', 'Docker'],
  ['Rust', 'Linux'],
  ['Solidity', 'Foundry', 'Hardhat'],
  ['Python', 'APIs'],
  ['AWS', 'Kubernetes'],
];

const CATEGORIES = ['Engineering', 'DevRel', 'Product', 'Design', 'Research'];

const SALARY_MAP: Record<string, [number, number]> = {
  Engineering: [100000, 220000],
  DevRel: [80000, 160000],
  Product: [110000, 180000],
  Design: [90000, 150000],
  Research: [120000, 250000],
};

function generateJob(): Job {
  const baseTitle = faker.helpers.arrayElement(TITLES);
  const level = faker.helpers.arrayElement(LEVELS);
  const category = faker.helpers.arrayElement(CATEGORIES);
  const stack = faker.helpers.arrayElement(STACKS);

  const [minBase, maxBase] = SALARY_MAP[category];
  const compMin = faker.number.int({ min: minBase, max: maxBase - 20000 });
  const compMax = compMin + faker.number.int({ min: 20000, max: 80000 });

  const isRemote = faker.datatype.boolean({ probability: 0.6 });

  return {
    title: `${level} ${baseTitle}`,
    company: faker.company.name(),
    location: isRemote
      ? 'Remote'
      : `${faker.location.city()}, ${faker.location.country()}`,
    remote: isRemote,
    category,
    stack,
    description: faker.lorem.paragraph(),
    compMin,
    compMax,
    compCurrency: faker.helpers.arrayElement(['USD', 'EUR', 'GBP']),
    expiryDays: faker.helpers.arrayElement([14, 30, 45, 60]),
    applyUrl: faker.internet.url(),
  };
}

// optional: deterministic seed (VERY useful for testing)
faker.seed(42);

export const JOBS: Job[] = Array.from({ length: 120 }, () => generateJob());

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
    `Seeding ${JOBS.length} generated jobs from ${account.address}...\n`,
  );

  const now = Date.now();

  const creates = JOBS.map((job) => {
    const postedAt = now;

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
        { key: 'compMin', value: job.compMin },
        { key: 'compMax', value: job.compMax },
        { key: 'compCurrency', value: job.compCurrency },
      ],
      expiresIn: ExpirationTime.fromDays(job.expiryDays),
    };
  });

  try {
    const results = await walletClient.mutateEntities({ creates });
    results.createdEntities.forEach((_, idx) => {
      const job = JOBS[idx];
      console.log(`- ${job.title} at ${job.company}`);
    });
  } catch (err) {
    console.error('Batch failed:', err);
  }
}

main().catch(console.error);
