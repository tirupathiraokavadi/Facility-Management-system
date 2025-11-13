import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: String,
  phone: String,
  role: { type: String, enum: ['customer', 'worker'], required: true },
  skills: [String],
  experience: String,
  hourlyRate: Number,
  responseTime: String,
});

export default mongoose.model('User', UserSchema);
