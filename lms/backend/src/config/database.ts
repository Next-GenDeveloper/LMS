import mongoose from 'mongoose';
import { Sequelize } from 'sequelize';
import { ENV } from './env';

// MongoDB Connection
export const connectMongoDB = async () => {
  try {
    await mongoose.connect(ENV.MONGODB_URL);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// PostgreSQL Connection
export const sequelize = new Sequelize(ENV.POSTGRES_URL, {
  dialect: 'postgres',
  logging: ENV.NODE_ENV === 'development' ? console.log : false,
});

export const connectPostgreSQL = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: ENV.NODE_ENV === 'development' });
    console.log('✅ PostgreSQL connected successfully');
  } catch (error) {
    console.error('❌ PostgreSQL connection error:', error);
    process.exit(1);
  }
};