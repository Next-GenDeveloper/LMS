import mongoose, { Document } from 'mongoose';
export interface ICertificate extends Document {
    student: mongoose.Types.ObjectId;
    course: mongoose.Types.ObjectId;
    enrollment: mongoose.Types.ObjectId;
    certificateNumber: string;
    issuedDate: Date;
    certificateUrl: string;
}
export declare const Certificate: mongoose.Model<ICertificate, {}, {}, {}, mongoose.Document<unknown, {}, ICertificate> & ICertificate & {
    _id: mongoose.Types.ObjectId;
}, any>;
