

import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  if (process.env.NODE_ENV === 'test' || !process.env.SMTP_HOST) {
    console.log('\n==================================================');
    console.log('🛠️  [TEST FALLBACK / NO SMTP] EMAIL DETAILS');
    console.log(`To:      ${options.email}`);
    console.log(`Subject: ${options.subject}`);
    
    // Extract OTP or verification code if present in HTML
    const otpMatch = options?.html?.match(/class="otp-code"[^>]*>([^<]+)</);
    if (otpMatch) {
      console.log(`🔑 CODE:  ${otpMatch[1].trim()}`);
    } else {
      const sixDigitMatch = options?.html?.match(/\b\d{6}\b/);
      if (sixDigitMatch) {
        console.log(`🔑 CODE:  ${sixDigitMatch[0]}`);
      }
    }
    console.log('==================================================\n');
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: false, 
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM}>`,
      to: options.email,
      subject: options.subject,
      html: options.html,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('📧 [SMTP Mail Error] Failed to send email:', error.message);
    console.error('📧 SMTP Config — HOST:', process.env.SMTP_HOST, '| PORT:', process.env.SMTP_PORT, '| USER:', process.env.SMTP_USER ? '(set)' : '(MISSING)');

    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
      console.log('\n==================================================');
      console.log('🛠️  [DEVELOPMENT FALLBACK] EMAIL DETAILS');
      console.log(`To:      ${options.email}`);
      console.log(`Subject: ${options.subject}`);
      
      // Extract OTP or verification code if present in HTML
      const otpMatch = options.html.match(/class="otp-code"[^>]*>([^<]+)</);
      if (otpMatch) {
        console.log(`🔑 CODE:  ${otpMatch[1].trim()}`);
      } else {
        const sixDigitMatch = options.html.match(/\b\d{6}\b/);
        if (sixDigitMatch) {
          console.log(`🔑 CODE:  ${sixDigitMatch[0]}`);
        }
      }
      console.log('==================================================\n');
      
      // Resolve successfully so the request proceeds without breaking local testing
      return;
    }

    // Rethrow error in production so callers can handle gracefully
    throw error;
  }
};

export default sendEmail;