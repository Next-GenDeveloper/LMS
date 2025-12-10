import mongoose, { Document } from 'mongoose';
export interface IChatMessage extends Document {
    course: mongoose.Types.ObjectId;
    sender: mongoose.Types.ObjectId;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare const ChatMessage: mongoose.Model<IChatMessage, {}, {}, {}, mongoose.Document<unknown, {}, IChatMessage> & IChatMessage & {
    _id: mongoose.Types.ObjectId;
}, any>;
