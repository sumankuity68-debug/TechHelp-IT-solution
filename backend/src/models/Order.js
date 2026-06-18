// FILE: backend/src/models/Order.js
// Stores completed Stripe payment records

import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    // Stored separately so we have it even if user deleted
    customerName:  { type: String, required: true },
    customerEmail: { type: String, required: true, lowercase: true, trim: true },

    // Plan info
    planId:    { type: String, required: true },   // 'starter' | 'professional' | 'enterprise'
    planName:  { type: String, required: true },
    billing:   { type: String, enum: ['monthly', 'yearly'], default: 'monthly' },

    // Amounts (in USD cents — Stripe stores pence/cents)
    amount:   { type: Number, required: true },   // e.g. 2900 = $29.00
    currency: { type: String, default: 'usd' },

    // Stripe references
    stripeSessionId:       { type: String, required: true, unique: true },
    stripePaymentIntentId: { type: String, default: '' },

    // Lifecycle
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },

    // Invoice number (human-readable)
    invoiceNumber: { type: String, unique: true },
  },
  { timestamps: true }
);

// Auto-generate INV-XXXXXXXX invoice number before saving
orderSchema.pre('save', function (next) {
  if (!this.invoiceNumber) {
    const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.invoiceNumber = `INV-${rand}`;
  }
  next();
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
