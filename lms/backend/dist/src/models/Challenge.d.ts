import mongoose, { Document } from 'mongoose';
export interface IChallenge extends Document {
    course: mongoose.Types.ObjectId;
    title: string;
    description: string;
    difficulty: 'easy' | 'medium' | 'hard';
    points: number;
    deadline?: Date;
    participants: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}
export declare const Challenge: mongoose.Model<IChallenge, {}, {}, {}, mongoose.Document<unknown, {}, IChallenge> & IChallenge & {
    _id: mongoose.Types.ObjectId;
}, any>;
