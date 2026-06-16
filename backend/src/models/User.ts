import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  googleId: string;
  name: string;
  email: string;
  profileImage: string;
  role: 'Teacher' | 'Candidate';
  lastLogin: Date;
  tokens?: {
    accessToken: string;
    refreshToken: string;
    expiryDate: number;
  };
}

const UserSchema: Schema = new Schema({
  googleId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  profileImage: { type: String },
  role: { type: String, enum: ['Teacher', 'Candidate'], default: 'Candidate' },
  lastLogin: { type: Date, default: Date.now },
  tokens: {
    accessToken: { type: String },
    refreshToken: { type: String },
    expiryDate: { type: Number }
  }
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);
