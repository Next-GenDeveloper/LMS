import mongoose, { Schema } from 'mongoose';
const submissionSchema = new Schema({
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    submissionDate: { type: Date, default: Date.now },
    fileUrl: { type: String, required: true },
    grade: { type: Number },
    feedback: { type: String },
    gradedAt: { type: Date },
    gradedBy: { type: Schema.Types.ObjectId, ref: 'User' },
});
const assignmentSchema = new Schema({
    course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    dueDate: { type: Date, required: true },
    totalPoints: { type: Number, default: 100 },
    submissions: [submissionSchema],
}, { timestamps: true });
export const Assignment = mongoose.model('Assignment', assignmentSchema);
