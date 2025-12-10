import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import path from 'path';
import errorHandler from './src/middleware/errorHandler.ts'; // Custom error handling middleware
import { securityHeaders, securityLogger, generalRateLimit } from './src/middleware/security.ts';
import authRoutes from './src/routes/auth.ts';
import courseRoutes from './src/routes/courses.ts';
import enrollmentRoutes from './src/routes/enrollments.ts';
import adminRoutes from './src/routes/admin.ts';
import userRoutes from './src/routes/users.ts';
import uploadRoutes from './src/routes/upload.ts';
import healthRoutes from './src/routes/health.ts';
import pdfRoutes from './src/routes/pdf.ts';

const app = express();

// Middleware
app.use(securityHeaders); // Custom security headers
app.use(securityLogger); // Security logging
app.use(generalRateLimit); // General rate limiting
app.use(cors()); // Enable CORS
app.use(helmet()); // Security middleware
app.use(bodyParser.json({ limit: '10mb' })); // JSON parsing
app.use(bodyParser.urlencoded({ extended: true })); // Form data parsing

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api', healthRoutes);
app.use('/api/pdf', pdfRoutes);

// Error handling middleware
app.use(errorHandler);

export default app;
