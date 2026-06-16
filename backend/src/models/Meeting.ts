import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IMeeting extends Document {
  title: string;
  description: string;
  organizerId: Types.ObjectId;
  candidateIds: Types.ObjectId[];
  startTime: Date;
  endTime: Date;
  meetingType: 'Interview' | 'Technical Assessment' | 'Training' | 'Classroom' | 'Mentorship' | 'Mock Interview' | 'Group Discussion';
  meetLink: string;
  calendarEventId: string;
  notes?: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
}

const MeetingSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  organizerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  candidateIds: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  meetingType: { 
    type: String, 
    enum: ['Interview', 'Technical Assessment', 'Training', 'Classroom', 'Mentorship', 'Mock Interview', 'Group Discussion'],
    required: true 
  },
  meetLink: { type: String },
  calendarEventId: { type: String },
  notes: { type: String },
  status: { type: String, enum: ['Scheduled', 'Completed', 'Cancelled'], default: 'Scheduled' }
}, { timestamps: true });

export default mongoose.model<IMeeting>('Meeting', MeetingSchema);
