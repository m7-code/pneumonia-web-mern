import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { connectDB } from './lib/db.js';
import authRoutes from './routes/auth.js';
import resultsRoutes from './routes/results.js';
import chatRoutes from './routes/chat.js';
// import dns from 'dns';

dotenv.config();

// dns.setServers(['8.8.8.8', '8.8.4.4']);

const app = express();

app.use(cors({ origin: 'http://localhost:8080', credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/results', resultsRoutes);
app.use('/api', chatRoutes);

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));