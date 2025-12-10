import mongoose, { Document } from 'mongoose';
export interface ILessonProgress {
    lessonId: string;
    completed: boolean;
    watchedDuration: number;
    completedAt?: Date;
}
export interface IProgress extends Document {
    student: mongoose.Types.ObjectId;
    course: mongoose.Types.ObjectId;
    enrollment: mongoose.Types.ObjectId;
    lessonsProgress: ILessonProgress[];
    quizzesCompleted: mongoose.Types.ObjectId[];
    assignmentsCompleted: mongoose.Types.ObjectId[];
    overallProgress: number;
    lastAccessedAt: Date;
}
export declare const Progress: mongoose.Model<IProgress, {}, {}, {}, mongoose.Document<unknown, {}, IProgress> & IProgress & {
    _id: mongoose.Types.ObjectId;
}, any>;
