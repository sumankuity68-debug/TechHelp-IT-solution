// FILE: backend/src/models/Visitor.js
// Tracks daily visitor counts (keyed by date YYYY-MM-DD)

import mongoose from 'mongoose';

const visitorSchema = new mongoose.Schema({
  date:  { type: String, required: true, unique: true }, // 'YYYY-MM-DD'
  count: { type: Number, default: 0 },
}, { timestamps: false });

const Visitor = mongoose.model('Visitor', visitorSchema);
export default Visitor;
