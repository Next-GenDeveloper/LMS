import mongoose, { Schema, Document } from 'mongoose';

export interface IModule {
  title: string;
  description: string;
  lessons: ILesson[];
}

export interface ILesson {
  title: string;
  description: string;
  videoUrl: string;
  duration: number; // in minutes
  materials?: string[]; // URLs to PDFs, docs, etc.
}

export interface ICourse extends Document {
  title: string;
  description: string;
  thumbnail: string;
  instructor: mongoose.Types.ObjectId;
  category: string;
  price: number;
  rating: number;
  reviews: number;
  modules: IModule[];
  quizzes: mongoose.Types.ObjectId[];
  assignments: mongoose.Types.ObjectId[];
  enrollmentCount: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // total hours
  language: string;
  tags: string[];
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const lessonSchema = new Schema<ILesson>({
  title: { type: String, required: true },
  description: { type: String },
  videoUrl: { type: String, required: true },
  duration: { type: Number, required: true }, // minutes
  materials: [{ type: String }],
});

const moduleSchema = new Schema<IModule>({
  title: { type: String, required: true },
  description: { type: String },
  lessons: [lessonSchema],
});

const courseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    thumbnail: { type: String },
    instructor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: String, required: true },
    price: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    modules: [moduleSchema],
    quizzes: [{ type: Schema.Types.ObjectId, ref: 'Quiz' }],
    assignments: [{ type: Schema.Types.ObjectId, ref: 'Assignment' }],
    enrollmentCount: { type: Number, default: 0 },
    level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
    duration: { type: Number }, // hours
    language: { type: String, default: 'English' },
    tags: [{ type: String }],
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true }
);

courseSchema.index({ title: 'text', description: 'text', tags: 'text' });

export const Course = mongoose.model<ICourse>('Course', courseSchema);