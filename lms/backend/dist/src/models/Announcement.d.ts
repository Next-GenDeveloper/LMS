import mongoose, { Document } from 'mongoose';
export interface IAnnouncement extends Document {
    title: string;
    message: string;
    type: 'info' | 'warning' | 'success' | 'error';
    isActive: boolean;
    createdBy: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Announcement: mongoose.Model<IAnnouncement, {}, {}, {}, mongoose.Document<unknown, {}, IAnnouncement> & IAnnouncement & {
    _id: mongoose.Types.ObjectId;
}, any>;
