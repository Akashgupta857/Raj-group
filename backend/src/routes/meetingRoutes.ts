import express from 'express';
import { createMeeting, getMeetings, deleteMeeting } from '../controllers/meetingController';
import { protect, teacherOnly } from '../middlewares/authMiddleware';

const router = express.Router();

router.route('/')
  .post(protect, teacherOnly, createMeeting)
  .get(protect, getMeetings);

router.route('/:id')
  .delete(protect, teacherOnly, deleteMeeting);

export default router;
