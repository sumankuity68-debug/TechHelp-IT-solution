import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    subject: {
      type: String,
      trim: true,
      maxlength: [200, 'Subject cannot exceed 200 characters'],
    },
    service: {
      type: String,
      trim: true,
    },
    expert: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Expert',
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      maxlength: [2000, 'Message cannot exceed 2000 characters'],
    },
    status: {
      type: String,
      enum: ['new', 'read', 'resolved'],
      default: 'new',
    },
    preferences: {
      type: String,
      trim: true,
      maxlength: [500, 'Preferences cannot exceed 500 characters'],
    },
  },
  { timestamps: true }
);

export default mongoose.model('Contact', contactSchema);
