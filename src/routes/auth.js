import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Signup route
router.post('/signup', async (req, res) => {
  const { roleNumber, password, name, department, year, gender,role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    
    const newUser = new User({
      roleNumber,
      password: hashedPassword,
      name,
      department,
      year,
      gender,
      role // Default role
      // role: 'student' // Default role
    });

    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed' });
  }
});

// auth.js routes
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ roleNumber: req.body.roleNumber });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { 
      expiresIn: '1h' 
    });

    res.json({
      token,
      user: {
        id: user._id,
        role: user.role,
        name: user.name,
        department: user.department,
        roleNumber: user.roleNumber
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add this me endpoint
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .lean();
      
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;