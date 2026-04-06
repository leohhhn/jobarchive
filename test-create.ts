import { createJob, getJobs } from './lib/create-job';
import { ExpirationTime, jsonToPayload } from '@arkiv-network/sdk/utils';
async function main() {
  // console.log('--- Creating job ---');
  // const key = await createJob({
  //   title: 'Developer Relations Engineer',
  //   author: '', // filled in when sending tx
  //   company: 'Golem Network',
  //   location: 'Remote',
  //   remote: true,
  //   stack: ['typescript', 'go', 'ethereum'],
  //   category: 'devrel',
  //   description: 'Join us to build on Golem Network.',
  //   compensation: '$120k - $150k',
  //   postedAt: Date.now(),
  //   expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
  // });
  // console.log('Created:', key);

  console.log('\n--- Reading all jobs ---');
  const jobs = await getJobs();
  jobs.forEach((job) => {
    console.log(`[${job.id}] ${job.title} @ ${job.company}`);
    console.log(`  category: ${job.category} | remote: ${job.remote}`);
    console.log(`  author: ${job.author}`);
    console.log(`  stack: ${job.stack.join(', ')}`);
    console.log(`  expires: ${new Date(job.expiresAt).toLocaleDateString()}`);
    console.log();
  });
}

main().catch(console.error);
