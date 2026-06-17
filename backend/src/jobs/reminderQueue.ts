import { Queue } from 'bullmq';

const connection = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD || undefined,
  tls: process.env.REDIS_HOST !== '127.0.0.1' ? {} : undefined
};

export const reminderQueue = new Queue('meeting-reminders', { connection });

export const scheduleReminders = async (meetingId: string, startTime: Date, title: string, emails: string[]) => {
  const meetingTime = new Date(startTime).getTime();
  const now = Date.now();

  const times = [
    { delay: meetingTime - 24 * 60 * 60 * 1000 - now, name: '24h' },
    { delay: meetingTime - 60 * 60 * 1000 - now, name: '1h' },
    { delay: meetingTime - 15 * 60 * 1000 - now, name: '15m' }
  ];

  for (const time of times) {
    if (time.delay > 0) {
      await reminderQueue.add(
        `reminder-${time.name}`,
        { meetingId, title, emails, type: time.name },
        { delay: time.delay }
      );
    }
  }
};
