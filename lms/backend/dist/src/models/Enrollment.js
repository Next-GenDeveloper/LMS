import mongoose, { Schema } from 'mongoose';
const enrollmentSchema = new Schema({
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    status: { type: String, enum: ['active', 'completed', 'cancelled'], default: 'active' },
    enrollmentDate: { type: Date, default: Date.now },
    completionDate: { type: Date },
    certificateId: { type: Schema.Types.ObjectId, ref: 'Certificate' },
    paymentStatus: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    paymentId: { type: String },
    progress: { type: Number, default: 0 },
}, { timestamps: true });
enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });
export const Enrollment = mongoose.model('Enrollment', enrollmentSchema);
