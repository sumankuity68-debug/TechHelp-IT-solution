import User from '../models/user.js';
import { parsePaginationParams } from '../utils/paginate.js';

// @desc    Get all users with pagination, search, and role filter
// @route   GET /api/users?page=1&limit=10&search=john&role=admin
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
  try {
    const { search, role } = req.query;

    // Build filter
    const filter = {};
    if (role && ['user', 'admin', 'expert'].includes(role)) {
      filter.role = role;
    }
    if (search) {
      const regex = new RegExp(search.trim(), 'i');
      filter.$or = [{ name: regex }, { email: regex }];
    }

    const { page, limit, sort, skip } = parsePaginationParams(req.query, { limit: 10 });
    const [data, total] = await Promise.all([
      User.find(filter).select('-password').sort(sort).skip(skip).limit(limit),
      User.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching users' });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting user' });
  }
};

// Update user role (admin only)
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating user' });
  }
};

// Update user name, email, and role (admin only)
export const updateUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;

    // Check if email already exists for another user
    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: req.params.id } });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'Email already in use by another user' });
      }
    }

    const updatedData = {};
    if (name) updatedData.name = name;
    if (email) updatedData.email = email;
    if (role) updatedData.role = role;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error('updateUser error:', error);
    res.status(500).json({ success: false, message: 'Error updating user' });
  }
};