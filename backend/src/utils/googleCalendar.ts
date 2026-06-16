import { google } from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

export const createCalendarEvent = async (accessToken: string, refreshToken: string, eventDetails: any) => {
  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken
  });

  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  const event = {
    summary: eventDetails.title,
    description: eventDetails.description,
    start: {
      dateTime: eventDetails.startTime,
      timeZone: 'UTC', // Ensure standard timezone or use user's timezone
    },
    end: {
      dateTime: eventDetails.endTime,
      timeZone: 'UTC',
    },
    attendees: eventDetails.attendees,
    conferenceData: {
      createRequest: {
        requestId: Math.random().toString(36).substring(7),
        conferenceSolutionKey: {
          type: 'hangoutsMeet'
        }
      }
    }
  };

  try {
    const res = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
      conferenceDataVersion: 1,
      sendUpdates: 'all'
    });

    return {
      eventId: res.data.id,
      meetLink: res.data.hangoutLink
    };
  } catch (error) {
    console.error('Error creating calendar event', error);
    throw error;
  }
};

export const deleteCalendarEvent = async (accessToken: string, refreshToken: string, eventId: string) => {
  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken
  });

  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  try {
    await calendar.events.delete({
      calendarId: 'primary',
      eventId: eventId,
      sendUpdates: 'all'
    });
  } catch (error) {
    console.error('Error deleting calendar event', error);
    throw error;
  }
};
