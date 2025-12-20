import mongoose, { Schema, Document } from 'mongoose';

export interface IPendingSignup extends Document {
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  role: 'student';
  otpHash: string;
  otpExpiresAt: Date;
  otpAttempts: number;
  otpResends: number;
  lastOtpSentAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const pendingSignupSchema = new Schema<IPendingSignup>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    passwordHash: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: false, default: '' },
    role: { type: String, enum: ['student'], default: 'student' },

    otpHash: { type: String, required: true },
    otpExpiresAt: { type: Date, required: true },
    otpAttempts: { type: Number, default: 0 },
    otpResends: { type: Number, default: 0 },
    lastOtpSentAt: { type: Date, required: true },
  },
  { timestamps: true }
);

// Auto-delete expired pending signups after 24h
pendingSignupSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 });

export const PendingSignup = mongoose.model<IPendingSignup>('PendingSignup', pendingSignupSchema);
