import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');

    // Purana test user hai to hata do (taake dobara chalane pe duplicate error na aaye)
    await User.deleteOne({ email: 'test@example.com' });

    const hashedPassword = await bcrypt.hash('password123', 10);

    const user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: hashedPassword,
    });

    console.log('Test user created:', user.email);
  } catch (err) {
    console.error('Seeding failed:', err.message);
  } finally {
    await mongoose.connection.close();
    process.exit();
  }
}

seed();