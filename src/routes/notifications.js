import express from 'express';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Admin middleware (for routes that require admin privileges)
const adminAuth = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Create notification (Admin only)
router.post('/', auth, adminAuth, async (req, res) => {
  const { title, content, target, departments } = req.body;

  try {
    const newNotification = new Notification({
      title,
      content,
      target,
      // If the notification is meant for specific departments, use the provided list; otherwise, leave it empty.
      departments: target === 'specific' ? departments : []
    });

    await newNotification.save();

    // Real-time notification logic using Socket.io
    // Ensure that in your main server file you have something like:
    // const io = new Server(server);
    // app.set('io', io);
    const io = req.app.get('io');
    if (io) {
      io.emit('newNotification', newNotification);
    }
    
    res.status(201).json(newNotification);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all notifications (for any logged in user, irrespective of role)
router.get('/', auth, async (req, res) => {
  try {
    // Fetch all notifications, sorted by newest first
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current user route
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
