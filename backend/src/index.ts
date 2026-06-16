import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import meetingRoutes from './routes/meetingRoutes';
import attendanceRoutes from './routes/attendanceRoutes';
import { startReminderWorker } from './jobs/reminderWorker';

dotenv.config();

const app = express();

// Connect to database
connectDB();

// Start Background Worker
startReminderWorker();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/attendance', attendanceRoutes);

// Basic Route
app.get('/', (req: Request, res: Response) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
