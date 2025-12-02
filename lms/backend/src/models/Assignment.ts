import mongoose, { Schema, Document } from 'mongoose';

export interface ISubmission {
  student: mongoose.Types.ObjectId;
  submissionDate: Date;
  fileUrl: string;
  grade?: number;
  feedback?: string;
  gradedAt?: Date;
  gradedBy?: mongoose.Types.ObjectId;
}

export interface IAssignment extends Document {
  course: mongoose.Types.ObjectId;
  title: string;
  description: string;
  dueDate: Date;
  totalPoints: number;
  submissions: ISubmission[];
  createdAt: Date;
}

const submissionSchema = new Schema<ISubmission>({
  student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  submissionDate: { type: Date, default: Date.now },
  fileUrl: { type: String, required: true },
  grade: { type: Number },
  feedback: { type: String },
  gradedAt: { type: Date },
  gradedBy: { type: Schema.Types.ObjectId, ref: 'User' },
});

const assignmentSchema = new Schema<IAssignment>(
  {
    course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    dueDate: { type: Date, required: true },
    totalPoints: { type: Number, default: 100 },
    submissions: [submissionSchema],
  },
  { timestamps: true }
);

export const Assignment = mongoose.model<IAssignment>('Assignment', assignmentSchema);