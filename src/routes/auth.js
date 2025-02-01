import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

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

// Login route
router.post('/login', async (req, res) => {
  const { roleNumber, password } = req.body;

  try {
    const user = await User.findOne({ roleNumber });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;