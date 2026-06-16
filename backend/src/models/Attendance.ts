import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IAttendance extends Document {
  meetingId: Types.ObjectId;
  userId: Types.ObjectId;
  joinTime: Date;
  leaveTime?: Date;
  duration?: number; // in minutes or seconds
  status: 'Present' | 'Late' | 'Left Early' | 'Absent';
}

const AttendanceSchema: Schema = new Schema({
  meetingId: { type: Schema.Types.ObjectId, ref: 'Meeting', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  joinTime: { type: Date, required: true },
  leaveTime: { type: Date },
  duration: { type: Number },
  status: { type: String, enum: ['Present', 'Late', 'Left Early', 'Absent'], required: true }
}, { timestamps: true });

export default mongoose.model<IAttendance>('Attendance', AttendanceSchema);
