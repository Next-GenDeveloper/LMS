import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import errorHandler from './src/middleware/errorHandler.ts'; // Custom error handling middleware
import authRoutes from './src/routes/auth.ts';
import courseRoutes from './src/routes/courses.ts';
import enrollmentRoutes from './src/routes/enrollments.ts';
import adminRoutes from './src/routes/admin.ts';
import userRoutes from './src/routes/users.ts';
import healthRoutes from './src/routes/health.ts';

const app = express();

// Middleware
app.use(cors()); // Enable CORS
app.use(helmet()); // Security middleware
app.use(bodyParser.json()); // JSON parsing

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api', healthRoutes);

// Error handling middleware
app.use(errorHandler);

export default app;
