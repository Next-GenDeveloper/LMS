import mongoose, { Document } from 'mongoose';
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
    passingScore: number;
    duration: number;
    retakeable: boolean;
    createdAt: Date;
}
export declare const Quiz: mongoose.Model<IQuiz, {}, {}, {}, mongoose.Document<unknown, {}, IQuiz> & IQuiz & {
    _id: mongoose.Types.ObjectId;
}, any>;
