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
   * Creates a validation rule to ensure that specific fields are present and non-empty in the request body.
   *
   * @param {string[]} fields - The names of the fields to check.
   * @returns {function(object): (string|null)} A validation function that takes an Express request (req) and returns an error message if any field is missing/empty, or null if validation passes.
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
   * Creates a validation rule to check if a specific field is a valid email format.
   *
   * @param {string} field - The name of the field to check.
   * @returns {function(object): (string|null)} A validation function that takes an Express request (req) and returns an error message if the field exists but is invalid, or null if valid/missing.
   */
  isEmail: (field) => (req) => {
    const val = req.body[field];
    if (val && !EMAIL_REGEX.test(String(val).trim())) {
      return `'${field}' must be a valid email address`;
    }
    return null;
  },

  /**
   * Creates a validation rule to ensure a string field meets a minimum length requirement.
   *
   * @param {string} field - The name of the field to check.
   * @param {number} len - The minimum allowed character length.
   * @returns {function(object): (string|null)} A validation function that takes an Express request (req) and returns an error message if the field length is too short, or null if valid/missing.
   */
  minLength: (field, len) => (req) => {
    const val = req.body[field];
    if (val && String(val).trim().length < len) {
      return `'${field}' must be at least ${len} characters long`;
    }
    return null;
  },

  /**
   * Creates a validation rule to ensure a string field does not exceed a maximum length requirement.
   *
   * @param {string} field - The name of the field to check.
   * @param {number} len - The maximum allowed character length.
   * @returns {function(object): (string|null)} A validation function that takes an Express request (req) and returns an error message if the field length is too long, or null if valid/missing.
   */
  maxLength: (field, len) => (req) => {
    const val = req.body[field];
    if (val && String(val).trim().length > len) {
      return `'${field}' must be no more than ${len} characters long`;
    }
    return null;
  },

  /**
   * Creates a validation rule to check if a specific field is a valid phone number.
   *
   * @param {string} field - The name of the field to check.
   * @returns {function(object): (string|null)} A validation function  that takes an Express request (req) and returns an error message if the field exists but is not a valid phone format, or null if valid/missing.
   */
  isPhone: (field) => (req) => {
    const val = req.body[field];
    if (val && !PHONE_REGEX.test(String(val).trim())) {
      return `'${field}' must be a valid phone number`;
    }
    return null;
  },

  /**
   * Creates a validation rule to ensure a field's value matches one of the specified allowed values.
   *
   * @param {string} field - The name of the field to check.
   * @param {any[]} allowed - An array of allowed values.
   * @returns {function(object): (string|null)} A validation function that takes an Express request (req) and returns an error message if the value is not matching the allowed array, or null if valid/missing.
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
 * Middleware factory that combines multiple validation rules into a single Express middleware.
 * If a rule fails, it responds with a 400 Bad Request error.
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
 *
 * @param {...function(object): (string|null)} rules - An array of validation rule functions to execute sequentially.
 * @returns {function(object, object, function): void} An Express middleware function.
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
