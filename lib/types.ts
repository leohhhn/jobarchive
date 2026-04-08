export const PROJECT_ATTRIBUTE = {
  key: 'project',
  value: 'Leon_JobArchive',
};

if (!PROJECT_ATTRIBUTE.value) {
  throw new Error(
    'Please set the value of PROJECT_ATTRIBUTE to a unique string that identifies your project. This will help you filter and manage your entities on the Arkiv network.',
  );
}

export interface JobPosting {
  id: string;
  title: string;
  company: string;
  location: string;
  remote: boolean;
  stack: string[];
  category: string;
  description: string;
  author: string;
  postedAt: number;
  expiresAt: number;
  compMin?: number;
  compMax?: number;
  compCurrency?: Currency;
  applyUrl: string;
}

export interface JobSearchProps {
  jobs: JobPosting[];
  categories: string[];
  limit: number;
}

export const FETCH_LIMITS = [20, 40, 70, 100, 150, 200, 250, 300] as const;
export type FetchLimit = (typeof FETCH_LIMITS)[number];
export const DEFAULT_FETCH_LIMIT: FetchLimit = 20;

export const EXPIRY_OPTIONS = [
  { label: '7 days', days: 7 },
  { label: '14 days', days: 14 },
  { label: '30 days', days: 30 },
  { label: '60 days', days: 60 },
  { label: '90 days', days: 90 },
] as const;

export const CURRENCIES = ['USD', 'EUR', 'GBP'] as const;
export type Currency = (typeof CURRENCIES)[number];

export const COMP_RANGES = [
  { label: 'Under $50k', min: 0, max: 50000 },
  { label: '$50k – $100k', min: 50000, max: 100000 },
  { label: '$100k – $150k', min: 100000, max: 150000 },
  { label: '$150k+', min: 150000, max: null },
] as const;

export const JOB_CATEGORIES = [
  'Engineering',
  'DevRel',
  'Research',
  'Design',
  'Product',
  'Other',
] as const;

export type JobCategory = (typeof JOB_CATEGORIES)[number];
