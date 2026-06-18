import mongoose from 'mongoose';

const loginRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    token: {
      type: String,
      default: null,
    },
    expiresAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 15 * 60 * 1000), // 15 minutes expiry
    },
  },
  {
    timestamps: true,
  }
);

// Add TTL index for automatic deletion of expired login requests
loginRequestSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const LoginRequest = mongoose.model('LoginRequest', loginRequestSchema);
export default LoginRequest;
