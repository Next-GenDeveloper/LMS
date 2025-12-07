import dotenv from 'dotenv';
dotenv.config();
export const ENV = {
    // Server
    PORT: process.env.PORT || 5000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    // Feature flags
    USE_POSTGRES: /^true$/i.test(process.env.USE_POSTGRES || ''),
    // Databases
    POSTGRES_URL: process.env.POSTGRES_URL || 'postgresql://user:password@localhost:5432/lms',
    MONGODB_URL: process.env.MONGODB_URL || 'mongodb://localhost:27017/lms',
    // JWT
    JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
    JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',
    // Email
    EMAIL_SERVICE: process.env.EMAIL_SERVICE || 'gmail',
    EMAIL_USER: process.env.EMAIL_USER || '',
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD || '',
    // Stripe
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || '',
    STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY || '',
    // Cloudinary
    CLOUDINARY_NAME: process.env.CLOUDINARY_NAME || '',
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || '',
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || '',
    // Frontend
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
};
