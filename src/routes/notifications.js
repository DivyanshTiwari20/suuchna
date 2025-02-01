import express from 'express';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Admin middleware
const adminAuth = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
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
      departments: target === 'specific' ? departments : []
    });

    await newNotification.save();
    
    // TODO: Add real-time notification logic here
    res.status(201).json(newNotification);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get notifications for current user
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    const query = user.role === 'admin' 
      ? {} 
      : {
          $or: [
            { target: 'all' },
            { departments: { $in: [user.department] } }
          ]
        };

    const notifications = await Notification.find(query).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;