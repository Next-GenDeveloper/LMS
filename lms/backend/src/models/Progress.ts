import mongoose, { Schema, Document } from 'mongoose';

export interface ILessonProgress {
  lessonId: string;
  completed: boolean;
  watchedDuration: number; // in minutes
  completedAt?: Date;
}

export interface IProgress extends Document {
  student: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;
  enrollment: mongoose.Types.ObjectId;
  lessonsProgress: ILessonProgress[];
  quizzesCompleted: mongoose.Types.ObjectId[];
  assignmentsCompleted: mongoose. Types.ObjectId[];
  overallProgress: number; // percentage
  lastAccessedAt: Date;
}

const lessonProgressSchema = new Schema<ILessonProgress>({
  lessonId: { type: String, required: true },
  completed: { type: Boolean, default: false },
  watchedDuration: { type: Number, default: 0 },
  completedAt: { type: Date },
});

const progressSchema = new Schema<IProgress>(
  {
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    enrollment: { type: Schema.Types.ObjectId, ref: 'Enrollment', required: true },
    lessonsProgress: [lessonProgressSchema],
    quizzesCompleted: [{ type: Schema.Types. ObjectId, ref: 'Quiz' }],
    assignmentsCompleted: [{ type: Schema.Types.ObjectId, ref: 'Assignment' }],
    overallProgress: { type: Number, default: 0 },
    lastAccessedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Progress = mongoose.model<IProgress>('Progress', progressSchema);