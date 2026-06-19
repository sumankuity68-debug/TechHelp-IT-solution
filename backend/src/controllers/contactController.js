import Contact from '../models/contact.js';
import Expert from '../models/expert.js';
import Service from '../models/service.js';
import sendEmail from '../utils/sendEmail.js';
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
    const { name, email, service, message, expertId, preferences } = req.body;

    if (!name || !email || !service || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Resolve expert
    let expert = null;
    if (expertId) {
      expert = await Expert.findById(expertId);
    } else {
      // Find service with this title or number
      const serviceDoc = await Service.findOne({
        $or: [{ title: service }, { num: service }]
      }).populate('expert');
      
      if (serviceDoc && serviceDoc.expert) {
        expert = serviceDoc.expert;
      }
    }

    const contactData = {
      name,
      email,
      service,
      message,
      preferences,
    };

    if (expert) {
      contactData.expert = expert._id;
    }

    const contact = await Contact.create(contactData);

    // Route email directly to expert
    if (expert && expert.email) {
      try {
        await sendEmail({
          email: expert.email,
          subject: `TechHelp Inquiry: Dynamic Query for ${service} from ${name}`,
          html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 24px; color: #1e293b; background-color: #f8fafc; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0;">
              <h2 style="color: #4f46e5; margin-top: 0; font-size: 20px; font-weight: 700; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px;">New Inquiry Received</h2>
              <p style="font-size: 15px; line-height: 1.6;">Hello <strong style="color: #0f172a;">${expert.name}</strong>,</p>
              <p style="font-size: 15px; line-height: 1.6; color: #475569;">You have received a new inquiry from a user regarding your specialized service area <strong>(${expert.role})</strong>.</p>
              
              <div style="background-color: #ffffff; padding: 18px; border-radius: 8px; margin: 20px 0; border: 1px solid #cbd5e1;">
                <p style="margin: 0 0 8px 0; font-size: 14px; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">Client Details</p>
                <p style="margin: 0 0 6px 0; font-size: 15px;"><strong style="color: #0f172a;">Name:</strong> ${name}</p>
                <p style="margin: 0 0 6px 0; font-size: 15px;"><strong style="color: #0f172a;">Email:</strong> <a href="mailto:${email}" style="color: #4f46e5; text-decoration: none;">${email}</a></p>
                <p style="margin: 0 0 6px 0; font-size: 15px;"><strong style="color: #0f172a;">Service Area:</strong> ${service}</p>
                ${preferences ? `<p style="margin: 0; font-size: 15px;"><strong style="color: #0f172a;">Tech Preferences:</strong> ${preferences}</p>` : ''}
              </div>

              <div style="background-color: #ffffff; padding: 18px; border-radius: 8px; border-left: 4px solid #4f46e5; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                <p style="margin: 0 0 8px 0; font-size: 14px; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">Message Content</p>
                <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #334155; white-space: pre-line;">${message}</p>
              </div>
              
              <p style="font-size: 12px; color: #94a3b8; text-align: center; margin-top: 32px; border-top: 1px solid #e2e8f0; padding-top: 16px;">This is an automated notification from CareerNest/TechHelp solutions dashboard.</p>
            </div>
          `,
        });
        console.log(`📧 Query routed successfully to expert email: ${expert.email}`);
      } catch (mailErr) {
        console.error(`❌ Email routing to expert failed: ${mailErr.message}`);
      }
    }

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
    if (status && ['new', 'read', 'resolved'].includes(status)) {
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

export const getUniqueVisitorCount = async (req, res) => {
  try {
    const emails = await Contact.distinct('email');
    res.status(200).json({ success: true, count: emails.length });
  } catch (error) {
    console.error('Get unique visitors error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching visitor count' });
  }
};

export const updateContactStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['new', 'read', 'resolved'].includes(status)) {
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