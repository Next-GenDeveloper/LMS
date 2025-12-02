import mongoose, { Schema, Document } from 'mongoose';

export interface IEnrollment extends Document {
  student: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;
  status: 'active' | 'completed' | 'cancelled';
  enrollmentDate: Date;
  completionDate?: Date;
  certificateId?: mongoose.Types.ObjectId;
  paymentStatus: 'pending' | 'completed' | 'failed';
  paymentId?: string;
  progress: number; // percentage 0-100
}

const enrollmentSchema = new Schema<IEnrollment>(
  {
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    status: { type: String, enum: ['active', 'completed', 'cancelled'], default: 'active' },
    enrollmentDate: { type: Date, default: Date.now },
    completionDate: { type: Date },
    certificateId: { type: Schema.Types.ObjectId, ref: 'Certificate' },
    paymentStatus: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    paymentId: { type: String },
    progress: { type: Number, default: 0 },
  },
  { timestamps: true }
);

enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

export const Enrollment = mongoose.model<IEnrollment>('Enrollment', enrollmentSchema);