import mongoose from 'mongoose';

const meetingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    topic: {
      type: String,
      required: [true, 'Please provide a topic or reason for the meeting'],
      trim: true,
      maxlength: [100, 'Topic cannot be more than 100 characters'],
    },
    date: {
      type: Date,
      required: [true, 'Please select a date for the meeting'],
    },
    time: {
      type: String,
      required: [true, 'Please select a time for the meeting'],
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
    },
    meetingLink: {
      type: String,
      default: '', // Admin can provide a Zoom/Google Meet link when confirming
    },
    notes: {
      type: String,
      default: '', // Admin can leave notes
    }
  },
  { timestamps: true }
);

export default mongoose.model('Meeting', meetingSchema);
