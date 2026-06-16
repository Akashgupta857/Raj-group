import { Request, Response } from 'express';
import Attendance from '../models/Attendance';
import Meeting from '../models/Meeting';

export const markJoin = async (req: Request, res: Response) => {
  try {
    const { meetingId } = req.body;
    const user = (req as any).user;

    const meeting = await Meeting.findById(meetingId);
    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }

    // Determine status
    const joinTime = new Date();
    let status = 'Present';
    const timeDiff = joinTime.getTime() - new Date(meeting.startTime).getTime();
    if (timeDiff > 15 * 60 * 1000) { // 15 mins late
      status = 'Late';
    }

    const attendance = new Attendance({
      meetingId,
      userId: user._id,
      joinTime,
      status
    });

    await attendance.save();

    res.status(201).json(attendance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const markLeave = async (req: Request, res: Response) => {
  try {
    const { attendanceId } = req.body;
    const user = (req as any).user;

    const attendance = await Attendance.findById(attendanceId);
    if (!attendance || attendance.userId.toString() !== user._id.toString()) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    attendance.leaveTime = new Date();
    attendance.duration = Math.floor((attendance.leaveTime.getTime() - new Date(attendance.joinTime).getTime()) / 60000); // duration in minutes

    const meeting = await Meeting.findById(attendance.meetingId);
    if (meeting) {
      const earlyLeaveThreshold = new Date(meeting.endTime).getTime() - 15 * 60 * 1000; // 15 mins before end
      if (attendance.leaveTime.getTime() < earlyLeaveThreshold) {
        attendance.status = 'Left Early';
      }
    }

    await attendance.save();

    res.json(attendance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getAttendanceReport = async (req: Request, res: Response) => {
  try {
    const { meetingId } = req.params;
    const user = (req as any).user;

    const meeting = await Meeting.findById(meetingId);
    if (!meeting || meeting.organizerId.toString() !== user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized or meeting not found' });
    }

    const attendanceRecords = await Attendance.find({ meetingId }).populate('userId', 'name email profileImage');

    res.json(attendanceRecords);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
