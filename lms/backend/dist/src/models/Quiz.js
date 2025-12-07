import mongoose, { Schema } from 'mongoose';
const questionSchema = new Schema({
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswer: { type: Number, required: true },
    explanation: { type: String },
});
const quizSchema = new Schema({
    course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    title: { type: String, required: true },
    description: { type: String },
    questions: [questionSchema],
    passingScore: { type: Number, default: 70 },
    duration: { type: Number, required: true },
    retakeable: { type: Boolean, default: true },
}, { timestamps: true });
export const Quiz = mongoose.model('Quiz', quizSchema);
