import Contact from '../models/contact.js';
import { paginate, parsePaginationParams } from '../utils/paginate.js';

// @desc    Get contacts submitted by the logged-in user (matched by email)
// @route   GET /api/contact/mine
// @access  Private
export const getMyContacts = async (req, res) => {
  try {
    const contacts = await Contact.find({ email: req.user.email })
      .sort('-createdAt')
      .limit(20);

    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching your contacts' });
  }
};

export const submitContact = async (req, res) => {
  try {
    const { name, email, service, message } = req.body;

    if (!name || !email || !service || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    const contact = await Contact.create({
      name,
      email,
      service,
      message,
    });

    res.status(201).json({
      success: true,
      message: 'Thank you! We will get back to you within 24 hours.',
      data: contact,
    });
  } catch (error) {
    console.error('Submit contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error submitting contact form',
    });
  }
};

// @desc    Get all contacts with pagination, filtering, and search
// @route   GET /api/contact?page=1&limit=10&status=pending&search=john
// @access  Private/Admin
export const getAllContacts = async (req, res) => {
  try {
    const { status, search } = req.query;

    // Build filter
    const filter = {};
    if (status && ['pending', 'contacted', 'closed'].includes(status)) {
      filter.status = status;
    }
    if (search) {
      const regex = new RegExp(search.trim(), 'i');
      filter.$or = [{ name: regex }, { email: regex }, { service: regex }];
    }

    // Run paginated query
    const { page, limit, sort, skip } = parsePaginationParams(req.query, { limit: 15 });
    const [data, total] = await Promise.all([
      Contact.find(filter).sort(sort).skip(skip).limit(limit),
      Contact.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching contacts',
    });
  }
};

export const updateContactStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['pending', 'contacted', 'closed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value',
      });
    }

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Contact status updated',
      data: contact,
    });
  } catch (error) {
    console.error('Update contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating contact',
    });
  }
};

export const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Contact deleted successfully',
    });
  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting contact',
    });
  }
};