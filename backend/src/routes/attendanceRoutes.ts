import express from 'express';
import { markJoin, markLeave, getAttendanceReport } from '../controllers/attendanceController';
import { protect, teacherOnly } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/join', protect, markJoin);
router.post('/leave', protect, markLeave);
router.get('/report/:meetingId', protect, teacherOnly, getAttendanceReport);

export default router;
