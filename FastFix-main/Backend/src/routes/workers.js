import express from 'express';
import User from '../models/User.js';
import dotenv from 'dotenv';
import { auth } from '../middleware/auth.js';
import twilio from 'twilio';
dotenv.config();
const router = express.Router();
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Get all workers
router.get('/', async (req, res) => {
  try {
    const workers = await User.find({ role: 'worker' })
      .select('-password')
      .sort({ rating: -1 });
    
    res.json(workers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get workers by skill
router.get('/skill/:skill', async (req, res) => {
  try {
    const { skill } = req.params;
    const workers = await User.find({
      role: 'worker',
      skills: { $regex: skill, $options: 'i' }
    })
    .select('-password')
    .sort({ rating: -1 });
    
    res.json(workers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get worker by ID
router.get('/:id', async (req, res) => {
  try {
    const worker = await User.findOne({
      _id: req.params.id,
      role: 'worker'
    }).select('-password').lean();

    if (!worker) {
      return res.status(404).json({ error: 'Worker not found' });
    }
    res.json({ ...worker, id: worker._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Call worker
/*
router.post('/:id/call', async (req, res) => {
  try {
    const { customerPhone } = req.body;
    const worker = await User.findById(req.params.id);
    if (!worker) {
      return res.status(404).json({ error: 'Worker not found' });
    }

    // Make call using Twilio
    const call = await client.calls.create({
      url: 'https://handler.twilio.com/twiml/EH7c2117bf7ce710638bd95c2f026dd7a6',
      to: `+91${worker.phone}`,
      from: process.env.TWILIO_PHONE_NUMBER,
    });
    res.json({
      success: true,
      message: 'Call initiated to customer',
      callSid: call.sid
    });    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:id/message', async (req, res) => {
  try {
    const { customerPhone } = req.body;
    const worker = await User.findById(req.params.id);
    if (!worker) {
      return res.status(404).json({ error: 'Worker not found' });
    }
    // Send SMS to worker
    await client.messages.create({
      body: `Hello ${worker.name}, You have received a new service booking request from one of our customers.
      If you are available to take the job, please confirm your availability.`,
      to: `+91${worker.phone}`,
      from: process.env.TWILIO_PHONE_NUMBER
    });
    
    res.json({
      success: true,
      message: 'message sent to customer'
    });    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
*/

export default router;
