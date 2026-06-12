import jwt from 'jsonwebtoken';

/**
 * Generates a signed JSON Web Token (JWT) containing the user ID.
 *
 * @param {string} id - The MongoDB User ID to encode in the token payload.
 * @returns {string} The signed JWT string.
 */
export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};
