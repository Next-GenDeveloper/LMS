import mongoose, { Schema } from 'mongoose';
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.ts';
const userSchema = new Schema({
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: false, default: '' },
    profilePicture: { type: String },
    bio: { type: String },
    phone: { type: String },
    role: { type: String, enum: ['student', 'admin'], default: 'student' },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    preferences: {
        interests: { type: [String], default: [] },
        preferredLanguage: { type: String, default: 'en' },
        notifications: { type: Boolean, default: true },
    },
}, { timestamps: true });
export const User = mongoose.model('User', userSchema);
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
        type: DataTypes.ENUM('student', 'admin'),
        defaultValue: 'student',
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
});
