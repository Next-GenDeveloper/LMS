import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface IQuiz extends Document {
  course: mongoose.Types.ObjectId;
  title: string;
  description: string;
  questions: IQuestion[];
  passingScore: number; // percentage
  duration: number; // minutes
  retakeable: boolean;
  createdAt: Date;
}

const questionSchema = new Schema<IQuestion>({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: Number, required: true },
  explanation: { type: String },
});

const quizSchema = new Schema<IQuiz>(
  {
    course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    title: { type: String, required: true },
    description: { type: String },
    questions: [questionSchema],
    passingScore: { type: Number, default: 70 },
    duration: { type: Number, required: true },
    retakeable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Quiz = mongoose.model<IQuiz>('Quiz', quizSchema);