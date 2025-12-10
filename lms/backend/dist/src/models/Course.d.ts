import mongoose, { Document } from 'mongoose';
export interface IModule {
    title: string;
    description: string;
    lessons: ILesson[];
}
export interface ILesson {
    title: string;
    description: string;
    videoUrl: string;
    duration: number;
    materials?: string[];
}
export interface ICourse extends Document {
    title: string;
    description: string;
    bannerImage?: string;
    pdfFiles?: string[];
    videoFiles?: string[];
    category: string;
    price: number;
    rating: number;
    reviews: number;
    modules: IModule[];
    quizzes: mongoose.Types.ObjectId[];
    assignments: mongoose.Types.ObjectId[];
    challenges: mongoose.Types.ObjectId[];
    enrollmentCount: number;
    level: 'beginner' | 'intermediate' | 'advanced';
    duration: number;
    language: string;
    tags: string[];
    isPublished: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Course: mongoose.Model<ICourse, {}, {}, {}, mongoose.Document<unknown, {}, ICourse> & ICourse & {
    _id: mongoose.Types.ObjectId;
}, any>;
