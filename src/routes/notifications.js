import express from 'express';
import Notification from '../models/Notification.js';

const router = express.Router();

// Create notification
router.post('/', async (req, res) => {
  const { title, content } = req.body;
  
  try {
    const newNotification = new Notification({ title, content });
    await newNotification.save();
    res.status(201).json(newNotification);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all notifications
router.get('/', async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ date: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;