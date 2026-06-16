import { Request, Response } from 'express';
import Meeting from '../models/Meeting';
import User from '../models/User';
import { createCalendarEvent, deleteCalendarEvent } from '../utils/googleCalendar';
import { scheduleReminders } from '../jobs/reminderQueue';

export const createMeeting = async (req: Request, res: Response) => {
  try {
    const { title, description, startTime, endTime, candidateIds, meetingType, notes } = req.body;
    const organizer = (req as any).user;

    const candidates = await User.find({ _id: { $in: candidateIds } });
    const attendees = candidates.map(c => ({ email: c.email }));

    let meetLink = '';
    let calendarEventId = '';

    // Mocking or real Google Calendar API call
    if (organizer.tokens?.accessToken) {
      try {
        const eventResult = await createCalendarEvent(
          organizer.tokens.accessToken,
          organizer.tokens.refreshToken,
          { title, description, startTime, endTime, attendees }
        );
        meetLink = eventResult.meetLink || '';
        calendarEventId = eventResult.eventId || '';
      } catch (err) {
        console.error('Calendar Event Creation Failed, proceeding without sync for now', err);
        // Fallback for demo purposes if token is invalid
        meetLink = 'https://meet.google.com/mock-link';
        calendarEventId = 'mock-event-id';
      }
    } else {
      meetLink = 'https://meet.google.com/mock-link';
      calendarEventId = 'mock-event-id';
    }

    const meeting = new Meeting({
      title,
      description,
      organizerId: organizer._id,
      candidateIds,
      startTime,
      endTime,
      meetingType,
      notes,
      meetLink,
      calendarEventId
    });

    await meeting.save();
    
    await scheduleReminders(meeting._id.toString(), startTime, title, attendees.map(a => a.email));

    res.status(201).json(meeting);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getMeetings = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    let meetings;

    if (user.role === 'Teacher') {
      meetings = await Meeting.find({ organizerId: user._id }).populate('candidateIds', 'name email profileImage');
    } else {
      meetings = await Meeting.find({ candidateIds: user._id }).populate('organizerId', 'name email profileImage');
    }

    res.json(meetings);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const deleteMeeting = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const organizer = (req as any).user;

    const meeting = await Meeting.findById(id);

    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }

    if (meeting.organizerId.toString() !== organizer._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (meeting.calendarEventId && organizer.tokens?.accessToken) {
      try {
        await deleteCalendarEvent(organizer.tokens.accessToken, organizer.tokens.refreshToken, meeting.calendarEventId);
      } catch (err) {
        console.error('Failed to delete calendar event', err);
      }
    }

    await Meeting.deleteOne({ _id: id });

    res.json({ message: 'Meeting removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
