import mongoose, { Schema, Document } from 'mongoose';

export interface ICertificate extends Document {
  student: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;
  enrollment: mongoose.Types.ObjectId;
  certificateNumber: string;
  issuedDate: Date;
  certificateUrl: string;
}

const certificateSchema = new Schema<ICertificate>(
  {
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    enrollment: { type: Schema.Types.ObjectId, ref: 'Enrollment', required: true },
    certificateNumber: { type: String, unique: true, required: true },
    issuedDate: { type: Date, default: Date.now },
    certificateUrl: { type: String, required: true },
  },
  { timestamps: true }
);

export const Certificate = mongoose.model<ICertificate>('Certificate', certificateSchema);