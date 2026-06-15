import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    num: {
      type: String,
      required: [true, 'Service number is required'],
      unique: true,
      trim: true,
    },
    title: {
      type: String,
      required: [true, 'Service title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Service description is required'],
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    icon: {
      type: String,
      trim: true,
      default: 'default',
    },
    tags: {
      type: [String],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    expert: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Expert',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Service', serviceSchema);
