import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  roleNumber: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ['student', 'admin'], default: 'student' },
  // role: { type: String, enum: ['student', 'admin'], default: 'student' },
  name: { type: String, required: true },
  department: { type: String, required: true },
  year: { type: Number, required: true },
  gender: { type: String, enum: ['male', 'female', 'other'] },
  subscribedDepartments: [{ type: String }]
});

export default mongoose.model('User', userSchema);