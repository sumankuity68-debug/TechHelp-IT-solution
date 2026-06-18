import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  // Test fallback if test mode or no mail keys are set
  if (process.env.NODE_ENV === 'test' || (!process.env.SMTP_HOST && !process.env.BREVO_API_KEY)) {
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

  // Method 1: If BREVO_API_KEY is configured, use the HTTPS REST API (Bypasses Render's port blocks!)
  if (process.env.BREVO_API_KEY) {
    try {
      const fromEmail = process.env.EMAIL_FROM || 'sumankuity68@gmail.com';
      const fromName = process.env.EMAIL_FROM_NAME || 'TechHelp IT Solutions';

      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api-key': process.env.BREVO_API_KEY,
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          sender: { name: fromName, email: fromEmail },
          to: [{ email: options.email }],
          subject: options.subject,
          htmlContent: options.html
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Brevo API error');
      }

      console.log(`📧 [Brevo API] Email sent successfully to ${options.email} (MessageID: ${data.messageId})`);
      return;
    } catch (apiError) {
      console.error('📧 [Brevo API Error]', apiError.message);
      // Fallback to SMTP if API fails
      console.log('🔄 Attempting fallback to SMTP transporter...');
    }
  }

  // Method 2: Traditional SMTP via nodemailer
  try {
    const port = parseInt(process.env.SMTP_PORT) || 587;
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: port,
      secure: port === 465, // True for 465, false for 587
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
      // ── Timeouts to prevent hanging forever ──────────────────
      connectionTimeout: 10000,  // 10 seconds to connect
      greetingTimeout: 10000,    // 10 seconds for SMTP greeting
      socketTimeout: 15000,      // 15 seconds of inactivity limit
    });

    const mailOptions = {
      from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM}>`,
      to: options.email,
      subject: options.subject,
      html: options.html,
    };

    // Hard deadline: if sendMail takes > 20 seconds, reject
    const sendWithTimeout = Promise.race([
      transporter.sendMail(mailOptions),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('SMTP timeout after 20 seconds')), 20000)
      ),
    ]);

    await sendWithTimeout;
    console.log(`📧 [SMTP] Email sent successfully to ${options.email}`);
  } catch (error) {
    console.error('📧 [SMTP Error]', error.message);
    console.error('📧 SMTP Config → HOST:', process.env.SMTP_HOST, '| PORT:', process.env.SMTP_PORT, '| USER:', process.env.SMTP_USER ? '(set)' : '(MISSING)');

    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
      console.log('\n==================================================');
      console.log('🛠️  [DEVELOPMENT FALLBACK] EMAIL DETAILS');
      console.log(`To:      ${options.email}`);
      console.log(`Subject: ${options.subject}`);
      
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
      
      return;
    }

    // Rethrow error in production so callers can handle gracefully
    throw error;
  }
};

export default sendEmail;