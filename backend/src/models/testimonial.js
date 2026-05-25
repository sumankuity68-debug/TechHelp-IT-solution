import mongoose from 'mongoose';

const replySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Reply name is required'],
    trim: true,
  },
  text: {
    type: String,
    required: [true, 'Reply text is required'],
    trim: true,
    maxlength: [1000, 'Reply cannot exceed 1000 characters'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const testimonialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    role: {
      type: String,
      trim: true,
      default: 'Client',
    },
    project: {
      type: String,
      trim: true,
      default: '',
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    text: {
      type: String,
      required: [true, 'Review text is required'],
      trim: true,
      maxlength: [2000, 'Review cannot exceed 2000 characters'],
    },
    likes: {
      type: Number,
      default: 0,
    },
    dislikes: {
      type: Number,
      default: 0,
    },
    replies: [replySchema],
  },
  { timestamps: true }
);

export default mongoose.model('Testimonial', testimonialSchema);
