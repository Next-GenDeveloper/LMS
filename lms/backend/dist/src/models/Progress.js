import mongoose, { Schema } from 'mongoose';
const lessonProgressSchema = new Schema({
    lessonId: { type: String, required: true },
    completed: { type: Boolean, default: false },
    watchedDuration: { type: Number, default: 0 },
    completedAt: { type: Date },
});
const progressSchema = new Schema({
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    enrollment: { type: Schema.Types.ObjectId, ref: 'Enrollment', required: true },
    lessonsProgress: [lessonProgressSchema],
    quizzesCompleted: [{ type: Schema.Types.ObjectId, ref: 'Quiz' }],
    assignmentsCompleted: [{ type: Schema.Types.ObjectId, ref: 'Assignment' }],
    overallProgress: { type: Number, default: 0 },
    lastAccessedAt: { type: Date, default: Date.now },
}, { timestamps: true });
export const Progress = mongoose.model('Progress', progressSchema);
