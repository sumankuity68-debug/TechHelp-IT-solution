// FILE: backend/src/controllers/visitorController.js
// Visitor analytics: ping (public, rate-limited) + stats (admin)

import Visitor from '../models/Visitor.js';

// ── POST /api/visitors/ping ───────────────────────────────────────────────────
// Called once per session from the frontend to count a unique visit.
// Rate limit is handled at route level (5 pings / IP / hour via express-rate-limit)
export const pingVisitor = async (req, res) => {
  try {
    const today = new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'

    // Upsert: increment count for today, create doc if first visit today
    await Visitor.findOneAndUpdate(
      { date: today },
      { $inc: { count: 1 } },
      { upsert: true, new: true }
    );

    res.status(200).json({ success: true });
  } catch (err) {
    // Silently fail — visitor tracking should never break the app
    console.error('[Visitor] ping error:', err.message);
    res.status(200).json({ success: true });
  }
};

// ── GET /api/visitors/stats ───────────────────────────────────────────────────
// Admin only — returns last 14 days of visitor data.
export const getVisitorStats = async (req, res) => {
  try {
    // Build array of last 14 date strings
    const days = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d.toISOString().slice(0, 10));
    }

    // Fetch all matching records
    const records = await Visitor.find({ date: { $in: days } }).lean();
    const recordMap = {};
    records.forEach(r => { recordMap[r.date] = r.count; });

    // Fill in zeros for days with no visits
    const stats = days.map(date => ({
      date,
      count: recordMap[date] || 0,
      label: new Date(date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    }));

    const total = stats.reduce((sum, s) => sum + s.count, 0);
    const today = stats[stats.length - 1]?.count || 0;
    const peak  = Math.max(...stats.map(s => s.count), 0);

    res.status(200).json({
      success: true,
      stats,
      summary: { total, today, peak },
    });
  } catch (err) {
    console.error('[Visitor] getStats error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};
