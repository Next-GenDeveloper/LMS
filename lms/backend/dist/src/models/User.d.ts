import mongoose, { Document } from 'mongoose';
export interface IUser extends Document {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
    bio?: string;
    phone?: string;
    role: 'student' | 'admin';
    isVerified: boolean;
    verificationToken?: string;
    preferences?: {
        interests?: string[];
        preferredLanguage?: string;
        notifications?: boolean;
    };
    achievements?: {
        certificates: mongoose.Types.ObjectId[];
        completedQuizzes: mongoose.Types.ObjectId[];
        completedChallenges: mongoose.Types.ObjectId[];
        points: number;
    };
    createdAt: Date;
    updatedAt: Date;
}
export declare const User: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser> & IUser & {
    _id: mongoose.Types.ObjectId;
}, any>;
export declare const UserPostgres: import("sequelize").ModelCtor<import("sequelize").Model<any, any>>;
