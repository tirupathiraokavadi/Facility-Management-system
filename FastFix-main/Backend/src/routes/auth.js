import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Register route for customers
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, phone } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      password: hashedPassword,
      name,
      phone,
      role: 'customer',
    });

    await user.save();
    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    
    res.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role,
        skills: user.skills || [],
        experience: user.experience || '',
        hourlyRate: user.hourlyRate || 0,
        responseTime: user.responseTime || ''
      },
      token
    });
    
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Register route for workers
router.post('/register/worker', async (req, res) => {
  try {
    const { email, password, name, phone, skills, experience,hourlyRate,responseTime } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      password: hashedPassword,
      name,
      phone,
      skills, // Save only selected skills
      experience,
      role: 'worker',
      hourlyRate,
      responseTime
    });

    await user.save();
    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    
    res.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role,
        skills: user.skills || [],
        experience: user.experience || '',
        hourlyRate: user.hourlyRate || 0,
        responseTime: user.responseTime || ''
      },
      token
    });
     
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    res.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role,
        skills: user.skills || [],
        experience: user.experience || '',
        hourlyRate: user.hourlyRate || 0,
        responseTime: user.responseTime || ''
      },
      token
    });
    
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update user route (with JWT validation)
router.put('/update', async (req, res) => {
  try {
    const { id, ...updates } = req.body;

    if (!id) {
      return res.status(400).json({ message: 'User ID is required.' });
    }

    // Prevent updating sensitive fields
    delete updates.email;
    delete updates.role;

    const updatedUser = await User.findByIdAndUpdate(id, updates, {
      new: true,
    }).lean();

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ message: 'Failed to update user profile.' });
  }
});

export default router;
