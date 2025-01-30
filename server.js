import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
// Add after middleware
import authRoutes from './src/routes/auth.js';
import notificationRoutes from './src/routes/notifications.js';

dotenv.config();

const app = express();
const PORT= process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());


//DB Connection
mongoose.connect(process.env.MONGO_URL)
.then(() => console.log('DB Connection Successful'))
.catch((err) => console.log("MongoDB connection error:",err));

// Routes
app.get('/', (req, res) => {
    res.send('Backend is working');
});
app.use('/api/auth', authRoutes);
app.use('/api/notifications', notificationRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});