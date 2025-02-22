import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import authRoutes from './src/routes/auth.js';
import notificationRoutes from './src/routes/notifications.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
// Configure CORS for Socket.io
const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173", // Allow frontend origin
      methods: ["GET", "POST"], // Allowed HTTP methods
      credentials: true, // Allow credentials (if needed)
    },
  });

// Middleware
app.use(
    cors({
      origin: "http://localhost:5173", // Allow frontend origin
      credentials: true, // Allow credentials (if needed)
    })
  );
app.use(express.json());

// DB Connection
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('DB Connection Successful'))
  .catch((err) => console.log("MongoDB connection error:", err));

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
  
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  
    // Listen for new notifications from clients
    socket.on('newNotification', (notification) => {
      console.log('New notification received:', notification);
      // Broadcast to all clients
      io.emit('notification', notification); // Use `io.emit` to send to all clients
    });
  });

// Routes
app.get('/', (req, res) => res.send('Backend is working'));
app.use('/api/auth', authRoutes);
app.use('/api/notifications', notificationRoutes);

server.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});

export { io };  // Export for use in other files if needed