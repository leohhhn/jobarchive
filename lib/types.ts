export const PROJECT_ATTRIBUTE = {
  key: 'project',
  value: 'JobArchiveTest3',
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
  // structured compensation
  compMin?: number;
  compMax?: number;
  compCurrency?: Currency;
  applyUrl: string;
}

export interface JobSearchProps {
  jobs: JobPosting[];
  categories: string[];
}

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
