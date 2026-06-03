// FILE: backend/src/middleware/validate.js
// ─────────────────────────────────────────────────────────────────────────
// Lightweight validation middleware factory.
// Returns a middleware that validates req.body fields and responds with
// 400 + descriptive error if validation fails.
// ─────────────────────────────────────────────────────────────────────────

// ── Validators ───────────────────────────────────────────────────────────

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[+]?[\d\s\-().]{7,15}$/;

const validators = {
  /**
   * Checks that all listed fields are present and non-empty in req.body.
   */
  required: (fields) => (req) => {
    for (const field of fields) {
      const val = req.body[field];
      if (val === undefined || val === null || String(val).trim() === '') {
        return `'${field}' is required`;
      }
    }
    return null;
  },

  /**
   * Validates that a field is a properly formatted email address.
   */
  isEmail: (field) => (req) => {
    const val = req.body[field];
    if (val && !EMAIL_REGEX.test(String(val).trim())) {
      return `'${field}' must be a valid email address`;
    }
    return null;
  },

  /**
   * Validates minimum string length for a field.
   */
  minLength: (field, len) => (req) => {
    const val = req.body[field];
    if (val && String(val).trim().length < len) {
      return `'${field}' must be at least ${len} characters long`;
    }
    return null;
  },

  /**
   * Validates maximum string length for a field.
   */
  maxLength: (field, len) => (req) => {
    const val = req.body[field];
    if (val && String(val).trim().length > len) {
      return `'${field}' must be no more than ${len} characters long`;
    }
    return null;
  },

  /**
   * Validates that a field is a valid phone number.
   */
  isPhone: (field) => (req) => {
    const val = req.body[field];
    if (val && !PHONE_REGEX.test(String(val).trim())) {
      return `'${field}' must be a valid phone number`;
    }
    return null;
  },

  /**
   * Validates that a field value is one of the allowed values.
   */
  isOneOf: (field, allowed) => (req) => {
    const val = req.body[field];
    if (val && !allowed.includes(val)) {
      return `'${field}' must be one of: ${allowed.join(', ')}`;
    }
    return null;
  },
};

// ── Middleware factory ────────────────────────────────────────────────────

/**
 * validate(...rules) — express middleware factory
 *
 * Usage:
 *   router.post('/login', validate(
 *     validators.required(['email', 'password']),
 *     validators.isEmail('email'),
 *     validators.minLength('password', 6),
 *   ), loginController);
 *
 * On failure: responds 400 with { success: false, message: '...' }
 * On pass:    calls next()
 */
export const validate = (...rules) => (req, res, next) => {
  for (const rule of rules) {
    const error = rule(req);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error,
      });
    }
  }
  next();
};

export default validators;
