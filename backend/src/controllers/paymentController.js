// FILE: backend/src/controllers/paymentController.js
// Stripe Checkout — create session + webhook handler + invoice email

import Stripe from 'stripe';
import Order from '../models/Order.js';
import User from '../models/user.js';
import sendEmail from '../utils/sendEmail.js';
import { generateInvoicePDF } from '../utils/generateInvoicePDF.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder_for_render_startup_only');

// ── Plan catalogue (mirrors frontend PricingSection.jsx) ─────────────────────
const PLANS = {
  starter: {
    name: 'Starter',
    monthlyPrice: 2900,   // cents
    yearlyPrice:  2300,
    description:  '1 Web App · REST APIs · JWT Auth · Email Support',
  },
  professional: {
    name: 'Professional',
    monthlyPrice: 7900,
    yearlyPrice:  6300,
    description:  'Up to 5 Apps · Google OAuth · Admin Dashboard · CI/CD',
  },
  enterprise: {
    name: 'Enterprise',
    monthlyPrice: 19900,
    yearlyPrice:  15900,
    description:  'Unlimited Apps · Full Auth Suite · Priority Support · AWS Deploy',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/payment/create-checkout-session
// Body: { planId, billing, userId? }
// ─────────────────────────────────────────────────────────────────────────────
export const createCheckoutSession = async (req, res) => {
  try {
    const { planId, billing = 'monthly' } = req.body;

    if (!PLANS[planId]) {
      return res.status(400).json({ success: false, message: 'Invalid plan selected.' });
    }

    const plan   = PLANS[planId];
    const amount = billing === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;
    const label  = `${plan.name} Plan (${billing === 'yearly' ? 'Yearly' : 'Monthly'})`;

    // Prefill customer email if user is logged in
    const customerEmail = req.user?.email || undefined;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: customerEmail,

      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: amount,
            product_data: {
              name: label,
              description: plan.description,
              images: ['https://techhelp-it-solution.vercel.app/logo.png'],
            },
          },
          quantity: 1,
        },
      ],

      // Stripe will redirect here after payment
      success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${process.env.FRONTEND_URL}/payment/cancel`,

      // Store metadata so we can use it in the webhook
      metadata: {
        planId,
        planName: plan.name,
        billing,
        userId: req.user?._id?.toString() || '',
      },
    });

    res.status(200).json({ success: true, url: session.url, sessionId: session.id });
  } catch (err) {
    console.error('[Stripe] createCheckoutSession error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/payment/session/:sessionId
// Called by success page to fetch order details
// ─────────────────────────────────────────────────────────────────────────────
export const getSessionDetails = async (req, res) => {
  try {
    const { sessionId } = req.params;

    // Try to find an already-processed order first
    const existing = await Order.findOne({ stripeSessionId: sessionId });
    if (existing) {
      return res.status(200).json({ success: true, order: existing });
    }

    // Otherwise fetch directly from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent', 'customer'],
    });

    res.status(200).json({
      success: true,
      session: {
        id:            session.id,
        status:        session.payment_status,
        customerEmail: session.customer_email || session.customer_details?.email,
        customerName:  session.customer_details?.name || 'Customer',
        amount:        session.amount_total,
        currency:      session.currency,
        planId:        session.metadata?.planId,
        planName:      session.metadata?.planName,
        billing:       session.metadata?.billing,
      },
    });
  } catch (err) {
    console.error('[Stripe] getSessionDetails error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};// ─────────────────────────────────────────────────────────────────────────────
// GET /api/payment/orders
// Admin only — returns all paid orders, newest first
// ─────────────────────────────────────────────────────────────────────────────
export const getOrders = async (req, res) => {
  try {
    const page  = parseInt(req.query.page,  10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip  = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find({ status: 'paid' })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Order.countDocuments({ status: 'paid' }),
    ]);

    res.status(200).json({
      success: true,
      data: orders,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
    });
  } catch (err) {
    console.error('[Orders] getOrders error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/payment/my-orders
// Logged in user — returns their own paid orders/plans
// ─────────────────────────────────────────────────────────────────────────────
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id, status: 'paid' })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (err) {
    console.error('[Payment] getMyOrders error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};
// ─────────────────────────────────────────────────────────────────────────────
// POST /api/payment/webhook
// Called by Stripe when payment_intent.succeeded / checkout.session.completed
// Must use raw body — handled in index.js with express.raw()
// ─────────────────────────────────────────────────────────────────────────────
export const stripeWebhook = async (req, res) => {
  const sig    = req.headers['stripe-signature'];
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, secret);
  } catch (err) {
    console.error('[Stripe Webhook] Signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    await handleCompletedSession(session);
  }

  res.status(200).json({ received: true });
};

// ── Internal: save order + send invoice email ─────────────────────────────────
async function handleCompletedSession(session) {
  try {
    // Avoid duplicate processing
    const exists = await Order.findOne({ stripeSessionId: session.id });
    if (exists) return;

    const metadata = session.metadata || {};
    const email    = session.customer_email || session.customer_details?.email || '';
    const name     = session.customer_details?.name || 'Customer';

    // Find user by email (optional linkage)
    const user = email ? await User.findOne({ email: email.toLowerCase() }) : null;

    const order = await Order.create({
      user:                  user?._id || null,
      customerName:          name,
      customerEmail:         email,
      planId:                metadata.planId   || 'unknown',
      planName:              metadata.planName  || 'Plan',
      billing:               metadata.billing   || 'monthly',
      amount:                session.amount_total,
      currency:              session.currency || 'usd',
      stripeSessionId:       session.id,
      stripePaymentIntentId: session.payment_intent || '',
      status:                'paid',
    });

    console.log(`[Stripe] ✅ Order saved: ${order.invoiceNumber} for ${email}`);

    // Send the invoice email
    if (email) {
      await sendInvoiceEmail(order);
    }
  } catch (err) {
    console.error('[Stripe] handleCompletedSession error:', err.message);
  }
}

// ── Build & send invoice HTML email ──────────────────────────────────────────
async function sendInvoiceEmail(order) {
  const amountFormatted = `$${(order.amount / 100).toFixed(2)}`;
  const dateFormatted   = new Date(order.createdAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Invoice — TechHelp IT Solutions</title>
</head>
<body style="margin:0;padding:0;background:#0f172a;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1e3a8a,#1d4ed8);border-radius:16px 16px 0 0;padding:36px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <div style="font-size:22px;font-weight:800;color:#fff;letter-spacing:-0.5px;">
                      Tech<span style="color:#93c5fd;">Help</span>
                      <span style="font-size:11px;background:rgba(255,255,255,0.15);padding:3px 8px;border-radius:6px;margin-left:6px;font-weight:600;letter-spacing:0.05em;">IT</span>
                    </div>
                    <div style="font-size:12px;color:#93c5fd;margin-top:4px;letter-spacing:0.05em;">IT SOLUTIONS</div>
                  </td>
                  <td align="right">
                    <div style="font-size:12px;color:#bfdbfe;text-transform:uppercase;letter-spacing:0.1em;">Invoice</div>
                    <div style="font-size:20px;font-weight:700;color:#fff;">${order.invoiceNumber}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#1e293b;padding:40px;">

              <!-- Thank you message -->
              <div style="font-size:24px;font-weight:700;color:#f1f5f9;margin-bottom:8px;">
                Thank you, ${order.customerName.split(' ')[0]}! 🎉
              </div>
              <div style="font-size:14px;color:#94a3b8;margin-bottom:32px;line-height:1.6;">
                Your payment was successful. Here is your official invoice for the <strong style="color:#60a5fa;">${order.planName} Plan</strong>.
              </div>

              <!-- Invoice details box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;border-radius:12px;padding:24px;margin-bottom:28px;border:1px solid #334155;">
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #1e293b;">
                    <table width="100%"><tr>
                      <td style="font-size:13px;color:#64748b;">Invoice Number</td>
                      <td align="right" style="font-size:13px;font-weight:600;color:#f1f5f9;">${order.invoiceNumber}</td>
                    </tr></table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #1e293b;">
                    <table width="100%"><tr>
                      <td style="font-size:13px;color:#64748b;">Date</td>
                      <td align="right" style="font-size:13px;font-weight:600;color:#f1f5f9;">${dateFormatted}</td>
                    </tr></table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #1e293b;">
                    <table width="100%"><tr>
                      <td style="font-size:13px;color:#64748b;">Billed To</td>
                      <td align="right" style="font-size:13px;font-weight:600;color:#f1f5f9;">${order.customerEmail}</td>
                    </tr></table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #1e293b;">
                    <table width="100%"><tr>
                      <td style="font-size:13px;color:#64748b;">Plan</td>
                      <td align="right" style="font-size:13px;font-weight:600;color:#60a5fa;">${order.planName} Plan</td>
                    </tr></table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #1e293b;">
                    <table width="100%"><tr>
                      <td style="font-size:13px;color:#64748b;">Billing Cycle</td>
                      <td align="right" style="font-size:13px;font-weight:600;color:#f1f5f9;">${order.billing === 'yearly' ? 'Yearly (20% off)' : 'Monthly'}</td>
                    </tr></table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:14px 0 0;">
                    <table width="100%"><tr>
                      <td style="font-size:15px;font-weight:700;color:#f1f5f9;">Total Paid</td>
                      <td align="right" style="font-size:22px;font-weight:800;color:#22c55e;">${amountFormatted}</td>
                    </tr></table>
                  </td>
                </tr>
              </table>

              <!-- Status badge -->
              <div style="text-align:center;margin-bottom:32px;">
                <span style="display:inline-block;background:rgba(34,197,94,0.12);border:1px solid rgba(34,197,94,0.3);color:#22c55e;padding:8px 24px;border-radius:50px;font-size:13px;font-weight:700;letter-spacing:0.05em;">
                  ✓ PAYMENT CONFIRMED
                </span>
              </div>

              <!-- What's Next -->
              <div style="background:#0f172a;border-radius:10px;padding:20px 24px;border-left:3px solid #3b82f6;margin-bottom:28px;">
                <div style="font-size:13px;font-weight:700;color:#60a5fa;margin-bottom:10px;letter-spacing:0.05em;text-transform:uppercase;">What Happens Next?</div>
                <div style="font-size:13px;color:#94a3b8;line-height:1.8;">
                  ✅ &nbsp;Your account has been upgraded to <strong style="color:#f1f5f9;">${order.planName}</strong><br/>
                  ✅ &nbsp;Our team will reach out within <strong style="color:#f1f5f9;">24 hours</strong> to onboard you<br/>
                  ✅ &nbsp;Access your dashboard to track everything<br/>
                  ✅ &nbsp;Keep this email as your receipt
                </div>
              </div>

              <!-- CTA -->
              <div style="text-align:center;margin-bottom:32px;">
                <a href="${process.env.FRONTEND_URL}/dashboard" 
                   style="display:inline-block;background:linear-gradient(135deg,#1d4ed8,#3b82f6);color:#fff;padding:14px 36px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:700;letter-spacing:0.02em;">
                  Go to Dashboard →
                </a>
              </div>

              <!-- Footer note -->
              <div style="font-size:12px;color:#475569;text-align:center;line-height:1.7;border-top:1px solid #1e293b;padding-top:24px;">
                Questions? Reply to this email or contact us at 
                <a href="mailto:sumakuity68@gmail.com" style="color:#60a5fa;text-decoration:none;">sumakuity68@gmail.com</a><br/>
                TechHelp IT Solutions · Kolkata, West Bengal, India<br/>
                <span style="font-size:11px;color:#334155;">This is an automated invoice. Please keep it for your records.</span>
              </div>
            </td>
          </tr>

          <!-- Bottom bar -->
          <tr>
            <td style="background:#0f172a;border-radius:0 0 16px 16px;padding:16px 40px;border-top:1px solid #1e293b;">
              <table width="100%"><tr>
                <td style="font-size:11px;color:#334155;">© 2026 TechHelp IT Solutions</td>
                <td align="right" style="font-size:11px;color:#334155;">Secure payment by Stripe</td>
              </tr></table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  try {
    const pdfBuffer = await generateInvoicePDF(order);

    await sendEmail({
      email:   order.customerEmail,
      subject: `Invoice ${order.invoiceNumber} — TechHelp IT Solutions`,
      html,
      attachments: [
        {
          filename: `Invoice-${order.invoiceNumber}.pdf`,
          content: pdfBuffer,
        }
      ]
    });
    console.log(`[Stripe] 📧 Invoice emailed to ${order.customerEmail} with PDF attachment`);
  } catch (err) {
    console.error('[Stripe] Invoice email failed:', err.message);
  }
}
