export interface JobPosting {
  id: string;
  title: string;
  company: string;
  location: string;
  remote: boolean;
  stack: string[];
  category: string;
  description: string;
  compensation?: string;
  author: string; // entity creator's address
  postedAt: number; // unix timestamp
  expiresAt: number; // unix timestamp
}

export const PROJECT_ATTRIBUTE = {
  key: 'project',
  value: 'TESTTESTLEONJOBS',
};
