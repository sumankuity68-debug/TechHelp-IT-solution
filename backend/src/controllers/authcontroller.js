
import crypto from 'crypto';
import sendEmail from '../utils/sendEmail.js';
import User from '../models/user.js';
import { OAuth2Client } from 'google-auth-library';
import { generateToken } from '../utils/token.js';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ── @route   POST /api/auth/google
// ── @desc    Sign in via Google OAuth (existing accounts only)
// ── @access  Public
export const googleAuth = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: 'Google credential token is required',
      });
    }

    // Verify the Google ID token
    let payload;
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload();
    } catch (verifyError) {
      console.error('Google token verification failed:', verifyError);
      return res.status(401).json({
        success: false,
        message: 'Invalid Google token. Please try again.',
      });
    }

    const { sub: googleId, email, name, picture } = payload;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Google account must have an email address',
      });
    }

    // Only allow existing accounts — no auto-registration via Google
    const user = await User.findOne({ $or: [{ googleId }, { email: email.toLowerCase() }] });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this Google email. Please sign up first.',
        requiresSignup: true,
      });
    }

    // Link Google account if not already linked
    if (!user.googleId) {
      user.googleId = googleId;
      user.authProvider = 'google';
    }
    if (!user.isVerified) {
      user.isVerified = true;
    }
    if (!user.avatar && picture) {
      user.avatar = picture;
    }
    await user.save({ validateBeforeSave: false });

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: 'Google sign-in successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar || '',
        phone: user.phone || '',
        address: user.address || '',
        bio: user.bio || '',
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during Google authentication',
    });
  }
};

// ── @route   POST /api/auth/google-token
// ── @desc    Sign in via Google access_token flow (existing accounts only — no auto-registration)
// ── @access  Public
export const googleTokenAuth = async (req, res) => {
  try {
    const { googleId, email, name, picture } = req.body;

    if (!googleId || !email) {
      return res.status(400).json({
        success: false,
        message: 'Google ID and email are required',
      });
    }

    // LOGIN MODE — only allow existing accounts, block new users
    const user = await User.findOne({ $or: [{ googleId }, { email: email.toLowerCase() }] });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this Google email. Please sign up first.',
        requiresSignup: true,
      });
    }

    // Link Google account if not already linked
    if (!user.googleId) {
      user.googleId = googleId;
      user.authProvider = 'google';
    }
    if (!user.isVerified) {
      user.isVerified = true;
    }
    if (!user.avatar && picture) {
      user.avatar = picture;
    }
    await user.save({ validateBeforeSave: false });

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: 'Google sign-in successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar || '',
        phone: user.phone || '',
        address: user.address || '',
        bio: user.bio || '',
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Google token auth error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during Google authentication',
    });
  }
};

// ── @route   POST /api/auth/google-signup
// ── @desc    Sign up / Sign in via Google on the Signup page (allows new user creation)
// ── @access  Public
export const googleSignupAuth = async (req, res) => {
  try {
    const { googleId, email, name, picture } = req.body;

    if (!googleId || !email) {
      return res.status(400).json({
        success: false,
        message: 'Google ID and email are required',
      });
    }

    // SIGNUP MODE — find existing user or create a new one
    let user = await User.findOne({ $or: [{ googleId }, { email: email.toLowerCase() }] });

    if (user) {
      // Existing user — just link Google if not already linked and log them in
      if (!user.googleId) {
        user.googleId = googleId;
        user.authProvider = 'google';
      }
      if (!user.isVerified) {
        user.isVerified = true;
      }
      if (!user.avatar && picture) {
        user.avatar = picture;
      }
      await user.save({ validateBeforeSave: false });
    } else {
      // New user — create account from Google profile (no password or OTP needed)
      user = await User.create({
        name,
        email: email.toLowerCase(),
        googleId,
        authProvider: 'google',
        avatar: picture || '',
        isVerified: true, // Google already verified the email
        role: 'user',
        phone: '',
      });
    }

    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: user.googleId ? 'Google sign-in successful' : 'Account created with Google successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar || '',
        phone: user.phone || '',
        address: user.address || '',
        bio: user.bio || '',
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Google signup auth error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during Google sign-up',
    });
  }
};

// ── @route   POST /api/auth/register
// ── @desc    Register new user + send verification email
// ── @access  Public
export const register = async (req, res) => {
  try {
    const { name, email, phone, password, role, adminCode } = req.body;

    // Validate input
    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, phone number, and password',
      });
    }

    // Admin code verification
    if (role === 'admin') {
      const VALID_ADMIN_CODE = process.env.ADMIN_SECRET_CODE || 'TECHHELP2026ADMIN';

      if (!adminCode) {
        return res.status(400).json({
          success: false,
          message: 'Admin verification code is required',
        });
      }

      if (adminCode !== VALID_ADMIN_CODE) {
        return res.status(403).json({
          success: false,
          message: 'Invalid admin verification code. Access denied.',
        });
      }
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email',
      });
    }

    // Create user (NOT verified yet)
    const user = await User.create({
      name,
      email,
      phone,
      password,
      role: role || 'user',
      isVerified: false, // ✅ Not verified initially
    });

    // ✅ Generate verification token
    const verificationToken = user.getVerificationToken();
    await user.save({ validateBeforeSave: false });

    // ✅ Send verification email
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 40px 30px; border-radius: 0 0 10px 10px; }
          .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
          .highlight { background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%); padding: 15px; border-left: 4px solid #667eea; margin: 20px 0; border-radius: 4px; }
          .otp-code { display: inline-block; font-size: 32px; font-weight: 700; color: #764ba2; letter-spacing: 6px; background: #fff; border: 2px dashed #667eea; padding: 15px 30px; border-radius: 10px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 28px;">🎉 Welcome to TechHelp!</h1>
          </div>
          <div class="content" style="text-align: center;">
            <p style="font-size: 16px; text-align: left;">Hi <strong>${user.name}</strong>,</p>
            <p style="text-align: left;">Thank you for signing up with <strong>TechHelp IT Solutions</strong>! We're excited to have you on board.</p>
            
            <div class="highlight" style="text-align: left;">
              <p style="margin: 0; font-size: 15px;">To complete your registration, please verify your email address by entering the 6-digit verification code below on the signup page:</p>
            </div>

            <div class="otp-code">${verificationToken}</div>

            <p style="font-size: 14px; color: #ef4444; font-weight: bold; margin-top: 20px;">This code will expire in 24 hours.</p>

            <div style="margin-top: 30px; border-top: 1px solid #ddd; padding-top: 20px; text-align: left;">
              <p style="font-size: 14px; font-weight: 700; color: #1a1a1a; margin-bottom: 10px;">
                🚀 Once verified, you'll unlock full access to:
              </p>
              <ul style="font-size: 13px; color: #666; padding-left: 20px; line-height: 1.8; margin: 0;">
                <li><strong>Personalized Dashboard</strong>: Track all your service requests and project statuses in one place.</li>
                <li><strong>24/7 Priority Support</strong>: Direct access to our expert IT team for quick resolutions.</li>
                <li><strong>Exclusive Resources</strong>: Guides, design assets, and development tips updated weekly.</li>
                <li><strong>Real-Time Collaboration</strong>: Invite team members and manage project milestones together.</li>
              </ul>
            </div>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} TechHelp IT Solutions. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: '✨ Verify Your Email - TechHelp IT Solutions',
        html,
      });

      res.status(201).json({
        success: true,
        message: 'Registration successful! Please check your email to verify your account.',
        requiresVerification: true,
      });
    } catch (emailError) {
      console.error('Verification code dispatch error:', emailError);

      // If email fails, delete the user and return error
      await User.findByIdAndDelete(user._id);

      return res.status(500).json({
        success: false,
        message: 'Failed to send verification code. Please try again.',
      });
    }
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
    });
  }
};

// ── @route   POST /api/auth/login
// ── @desc    Login user (only if email verified)
// ── @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // ✅ Check if email is verified
    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: 'Please verify your email before logging in. Check your inbox for the verification link.',
        requiresVerification: true,
      });
    }

    // Check if user has a password set (e.g., they registered via Google)
    if (!user.password) {
      return res.status(400).json({
        success: false,
        message: 'This account was created using Google. Please log in with Google.',
      });
    }

    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar || '',
        phone: user.phone || '',
        address: user.address || '',
        bio: user.bio || '',
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone,
        address: user.address,
        bio: user.bio,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching user data',
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, phone, address, bio, avatar } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone, address, bio, avatar },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        avatar: updatedUser.avatar,
        phone: updatedUser.phone,
        address: updatedUser.address,
        bio: updatedUser.bio,
        createdAt: updatedUser.createdAt,
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating profile',
    });
  }
};
// ── @route   POST /api/auth/forgot-password
// ── @desc    Send password reset email
// ── @access  Public
export const forgotPassword = async (req, res) => {
  let user;
  try {
    const { email, deliveryMethod } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email address',
      });
    }

    // Find user by email
    user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account found with that email address',
      });
    }

    // Generate 6-digit OTP code
    const otp = user.getResetPasswordOTP();
    await user.save({ validateBeforeSave: false });

    // Email HTML template
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .otp-code { display: inline-block; font-size: 32px; font-weight: 700; color: #764ba2; letter-spacing: 6px; background: #fff; border: 2px dashed #667eea; padding: 15px 30px; border-radius: 10px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Password Reset OTP</h1>
          </div>
          <div class="content" style="text-align: center;">
            <p style="text-align: left;">Hi ${user.name},</p>
            <p style="text-align: left;">You requested to reset your password for your <strong>TechHelp IT Solutions</strong> account.</p>
            <p style="text-align: left;">Use the 6-digit One-Time Password (OTP) below to reset your password:</p>
            <div class="otp-code">${otp}</div>
            <p style="font-weight: bold;">This code is valid for 15 minutes.</p>
            <p style="text-align: left; color: #666; font-size: 13px;">If you didn't request this, please ignore this email and your password will remain unchanged.</p>
            <p style="text-align: left; color: #999; font-size: 11px;">For security reasons, never share this code with anyone.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} TechHelp IT Solutions. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email
    await sendEmail({
      email: user.email,
      subject: 'Password Reset OTP - TechHelp IT Solutions',
      html,
    });

    res.status(200).json({
      success: true,
      message: 'Password reset OTP sent successfully. Please check your inbox.',
    });
  } catch (error) {
    console.error('Forgot password error:', error);

    // Clear reset token if email/SMS fails
    if (user) {
      user.resetPasswordToken = null;
      user.resetPasswordExpire = null;
      await user.save({ validateBeforeSave: false });
    }

    res.status(500).json({
      success: false,
      message: 'Email/SMS could not be sent. Please try again later.',
    });
  }
};


export const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const { token } = req.params;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a new password',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters',
      });
    }

    // Hash the token from URL to match database
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Find user with valid token that hasn't expired
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }, // Token not expired
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token. Please request a new one.',
      });
    }

    // Set new password (will be hashed by pre-save middleware)
    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successful! You can now login with your new password.',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during password reset',
    });
  }
};

export const resetPasswordOTP = async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    if (!email || !otp || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email, OTP code, and new password',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters',
      });
    }

    // Hash the received OTP code to match the database entry
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(otp.trim())
      .digest('hex');

    // Find the user with matching email, active token, and not expired
    const user = await User.findOne({
      email: email.toLowerCase(),
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP code. Please request a new one.',
      });
    }

    // Set new password (will be hashed by pre-save middleware)
    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successful! You can now login with your new password.',
    });
  } catch (error) {
    console.error('Reset password OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during password reset',
    });
  }
};

// Helper to mask email address for security (e.g. s*******8@gmail.com)
const maskEmail = (email) => {
  const [localPart, domain] = email.split('@');
  if (localPart.length <= 2) {
    return `${localPart[0]}*@${domain}`;
  }
  return `${localPart[0]}${'*'.repeat(localPart.length - 2)}${localPart[localPart.length - 1]}@${domain}`;
};

// ── @route   POST /api/auth/find-account
// ── @desc    Find account by email and return masked public details
// ── @access  Public
export const findAccount = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email address',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account found with that email address',
      });
    }

    res.status(200).json({
      success: true,
      user: {
        name: user.name,
        avatar: user.avatar,
        maskedEmail: maskEmail(user.email),
      },
    });
  } catch (error) {
    console.error('Find account error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error searching for account',
    });
  }
};

// ── @route   GET /api/auth/verify-email/:token
// ── @desc    Verify email address using verification token
// ── @access  Public
export const verifyEmail = async (req, res) => {
  try {
    let token;
    let email;

    if (req.method === 'POST') {
      email = req.body.email;
      token = req.body.otp || req.body.token;
    } else {
      token = req.params.token;
    }

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Verification code or token is required',
      });
    }

    // Hash token to match database entry
    const verificationToken = crypto
      .createHash('sha256')
      .update(String(token).trim())
      .digest('hex');

    // Find the user with matching token/email and not expired
    const query = {
      verificationToken,
      verificationTokenExpire: { $gt: Date.now() },
    };

    if (email) {
      query.email = email.toLowerCase();
    }

    const user = await User.findOne(query);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification code or token. Please request a new one.',
      });
    }

    // Update user verification status
    user.isVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpire = null;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: 'Email verified successfully! You can now log in.',
    });
  } catch (error) {
    console.error('Verify email error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during email verification',
    });
  }
};

// ── @route   POST /api/auth/resend-verification
// ── @desc    Resend email verification token
// ── @access  Public
export const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email address',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account found with that email address',
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'This email is already verified',
      });
    }

    // Generate new verification token
    const verificationToken = user.getVerificationToken();
    await user.save({ validateBeforeSave: false });

    // Send verification email
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 40px 30px; border-radius: 0 0 10px 10px; }
          .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
          .highlight { background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%); padding: 15px; border-left: 4px solid #667eea; margin: 20px 0; border-radius: 4px; }
          .otp-code { display: inline-block; font-size: 32px; font-weight: 700; color: #764ba2; letter-spacing: 6px; background: #fff; border: 2px dashed #667eea; padding: 15px 30px; border-radius: 10px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 28px;">🎉 Welcome to TechHelp!</h1>
          </div>
          <div class="content" style="text-align: center;">
            <p style="font-size: 16px; text-align: left;">Hi <strong>${user.name}</strong>,</p>
            <p style="text-align: left;">Thank you for signing up with <strong>TechHelp IT Solutions</strong>! We're excited to have you on board.</p>
            
            <div class="highlight" style="text-align: left;">
              <p style="margin: 0; font-size: 15px;">To complete your registration, please verify your email address by entering the 6-digit verification code below on the signup page:</p>
            </div>

            <div class="otp-code">${verificationToken}</div>

            <p style="font-size: 14px; color: #ef4444; font-weight: bold; margin-top: 20px;">This code will expire in 24 hours.</p>

            <div style="margin-top: 30px; border-top: 1px solid #ddd; padding-top: 20px; text-align: left;">
              <p style="font-size: 14px; font-weight: 700; color: #1a1a1a; margin-bottom: 10px;">
                🚀 Once verified, you'll unlock full access to:
              </p>
              <ul style="font-size: 13px; color: #666; padding-left: 20px; line-height: 1.8; margin: 0;">
                <li><strong>Personalized Dashboard</strong>: Track all your service requests and project statuses in one place.</li>
                <li><strong>24/7 Priority Support</strong>: Direct access to our expert IT team for quick resolutions.</li>
                <li><strong>Exclusive Resources</strong>: Guides, design assets, and development tips updated weekly.</li>
                <li><strong>Real-Time Collaboration</strong>: Invite team members and manage project milestones together.</li>
              </ul>
            </div>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} TechHelp IT Solutions. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const smsMessage = `🎉 Welcome back to TechHelp! Your verification code is: ${verificationToken}. Valid for 24 hours.`;

    try {
      await sendEmail({
        email: user.email,
        subject: '✨ Verify Your Email - TechHelp IT Solutions',
        html,
      });

      res.status(200).json({
        success: true,
        message: 'Verification code resent successfully! Please check your inbox.',
      });
    } catch (emailError) {
      console.error('Resend verification error:', emailError);

      return res.status(500).json({
        success: false,
        message: 'Failed to resend verification code. Please try again.',
      });
    }
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error resending verification email',
    });
  }
};

// @desc    Change password using current password (logged in users)
// @route   PUT /api/auth/change-password
// @access  Private
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current password and new password',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters',
      });
    }

    // Fetch user and explicitly select password field
    const user = await User.findById(req.user.id).select('+password');

    // Check if user has a password set (e.g., they registered via Google)
    if (!user.password) {
      return res.status(400).json({
        success: false,
        message: 'This account does not have a password set. Please use the Forgot Password flow to set a password.',
      });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Incorrect current password',
      });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error changing password',
    });
  }
};