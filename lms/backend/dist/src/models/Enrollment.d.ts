import mongoose, { Document } from 'mongoose';
export interface IEnrollment extends Document {
    student: mongoose.Types.ObjectId;
    course: mongoose.Types.ObjectId;
    status: 'active' | 'completed' | 'cancelled';
    enrollmentDate: Date;
    completionDate?: Date;
    certificateId?: mongoose.Types.ObjectId;
    paymentStatus: 'pending' | 'completed' | 'failed';
    paymentId?: string;
    progress: number;
}
export declare const Enrollment: mongoose.Model<IEnrollment, {}, {}, {}, mongoose.Document<unknown, {}, IEnrollment> & IEnrollment & {
    _id: mongoose.Types.ObjectId;
}, any>;
