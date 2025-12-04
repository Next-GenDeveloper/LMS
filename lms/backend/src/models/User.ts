import mongoose, { Schema, Document } from 'mongoose';
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.ts';

// MongoDB User Schema
export interface IUser extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  bio?: string;
  phone?: string;
  role: 'student' | 'instructor' | 'admin';
  isVerified: boolean;
  verificationToken?: string;
  preferences?: {
    interests?: string[];
    preferredLanguage?: string;
    notifications?: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: false, default: '' },
    profilePicture: { type: String },
    bio: { type: String },
    phone: { type: String },
    role: { type: String, enum: ['student', 'instructor', 'admin'], default: 'student' },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    preferences: {
      interests: { type: [String], default: [] },
      preferredLanguage: { type: String, default: 'en' },
      notifications: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', userSchema);

// PostgreSQL User Model (for reference/audit)
export const UserPostgres = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  firstName: DataTypes.STRING,
  lastName: DataTypes.STRING,
  role: {
    type: DataTypes.ENUM('student', 'instructor', 'admin'),
    defaultValue: 'student',
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});