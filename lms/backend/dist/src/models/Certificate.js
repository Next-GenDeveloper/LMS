import mongoose, { Schema } from 'mongoose';
const certificateSchema = new Schema({
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    enrollment: { type: Schema.Types.ObjectId, ref: 'Enrollment', required: true },
    certificateNumber: { type: String, unique: true, required: true },
    issuedDate: { type: Date, default: Date.now },
    certificateUrl: { type: String, required: true },
}, { timestamps: true });
export const Certificate = mongoose.model('Certificate', certificateSchema);
