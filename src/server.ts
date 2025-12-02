import express from 'express';
import mongoose from 'mongoose';
import { Client } from 'pg';
import app from './app'; // Assuming app is exported from app.ts

const PORT = process.env.PORT || 3000;

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mydatabase', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// PostgreSQL connection
const pgClient = new Client({
    connectionString: process.env.POSTGRES_URI || 'postgres://user:password@localhost:5432/mydatabase'
});

pgClient.connect()
    .then(() => console.log('Connected to PostgreSQL'))
    .catch(err => console.error('PostgreSQL connection error:', err));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
