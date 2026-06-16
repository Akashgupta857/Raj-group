import { Worker } from 'bullmq';

const connection = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: parseInt(process.env.REDIS_PORT || '6379')
};

export const startReminderWorker = () => {
  const worker = new Worker('meeting-reminders', async job => {
    const { title, emails, type } = job.data;
    
    // In a real application, you would use Nodemailer or SendGrid here
    console.log(`[Email Mock] Sending ${type} reminder for meeting: "${title}" to ${emails.join(', ')}`);
    
  }, { connection });

  worker.on('completed', job => {
    console.log(`${job.id} has completed!`);
  });

  worker.on('failed', (job, err) => {
    console.log(`${job?.id} has failed with ${err.message}`);
  });

  console.log('Reminder Worker Started');
};
