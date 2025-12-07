import mongoose, { Schema } from 'mongoose';
const lessonSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    videoUrl: { type: String, required: true },
    duration: { type: Number, required: true }, // minutes
    materials: [{ type: String }],
});
const moduleSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    lessons: [lessonSchema],
});
const courseSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    thumbnail: { type: String },
    category: { type: String, required: true },
    price: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    modules: [moduleSchema],
    quizzes: [{ type: Schema.Types.ObjectId, ref: 'Quiz' }],
    assignments: [{ type: Schema.Types.ObjectId, ref: 'Assignment' }],
    enrollmentCount: { type: Number, default: 0 },
    level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
    duration: { type: Number }, // hours
    language: { type: String, default: 'English' },
    tags: [{ type: String }],
    isPublished: { type: Boolean, default: false },
}, { timestamps: true });
courseSchema.index({ title: 'text', description: 'text', tags: 'text' });
export const Course = mongoose.model('Course', courseSchema);
