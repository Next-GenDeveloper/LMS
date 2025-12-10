import mongoose, { Document } from 'mongoose';
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
export declare const Assignment: mongoose.Model<IAssignment, {}, {}, {}, mongoose.Document<unknown, {}, IAssignment> & IAssignment & {
    _id: mongoose.Types.ObjectId;
}, any>;
