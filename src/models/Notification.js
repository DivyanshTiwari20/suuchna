import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  target: {
    type: String,
    enum: ['all', 'specific'],
    default: 'all'
  },
  departments: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Notification', notificationSchema);