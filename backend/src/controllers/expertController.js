import Expert from '../models/expert.js';
import User from '../models/user.js';
import Contact from '../models/contact.js';

// Sync/create user account for an expert
const syncExpertUserAccount = async (expertData) => {
  const { name, email, accessCode, isApproved } = expertData;
  let user = await User.findOne({ email: email.toLowerCase() });
  
  if (!user) {
    user = await User.create({
      name,
      email: email.toLowerCase(),
      password: accessCode,
      role: 'expert',
      isVerified: isApproved !== false,
    });
    console.log(`👤 Created user login for expert: ${email}`);
  } else {
    user.name = name;
    user.password = accessCode;
    user.role = 'expert';
    if (isApproved !== undefined) {
      user.isVerified = isApproved;
    }
    await user.save();
    console.log(`👤 Updated user login for expert: ${email}`);
  }
  return user;
};

// Seed default experts if DB is empty
export const seedDefaultExperts = async () => {
  try {
    const defaults = [
      {
        name: 'Prietish Patahk',
        role: 'Senior Full-Stack Engineer',
        email: 'prietish12@gmail.com',
        phone: '91 75950 42847',
        accessCode: 'prietish123',
      },
      {
        name: 'Soumyadip Dey',
        role: 'Backend Architecture Lead',
        email: 'kutidey00677@gmail.com',
        phone: '9007597461',
        accessCode: 'soumyadip123',
      },
      {
        name: 'Aritra Hazra',
        role: 'Cloud Infrastructure Architect',
        email: 'aritrahazra701@gmail.com',
        phone: '90075 06883',
        accessCode: 'aritra123',
      },
      {
        name: 'Sneha Das',
        role: 'Lead UX Designer',
        email: 'sneha.ux@example.com',
        phone: '9999988888',
        accessCode: 'sneha123',
      }
    ];
    
    // Create experts in DB
    const createdExperts = await Expert.insertMany(defaults);
    console.log('✅ Default experts seeded successfully');
    
    // Create matching User login credentials
    for (const exp of createdExperts) {
      await syncExpertUserAccount(exp);
    }
  } catch (err) {
    console.error('❌ Error seeding default experts:', err.message);
  }
};

// @desc    Get all experts
// @route   GET /api/experts
// @access  Public
export const getAllExperts = async (req, res) => {
  try {
    const count = await Expert.countDocuments();
    if (count === 0) {
      await seedDefaultExperts();
    }
    const experts = await Expert.find().sort({ createdAt: 1 });
    res.status(200).json({
      success: true,
      count: experts.length,
      data: experts,
    });
  } catch (error) {
    console.error('Get experts error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching experts',
    });
  }
};

// @desc    Create expert
// @route   POST /api/experts
// @access  Private/Admin
export const createExpert = async (req, res) => {
  try {
    const { name, role, email, phone, accessCode } = req.body;
    if (!name || !role || !email || !phone || !accessCode) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, role, email, phone, and accessCode',
      });
    }
    
    // Create expert in DB
    const expert = await Expert.create({ name, role, email, phone, accessCode });
    
    // Create/Sync User account
    await syncExpertUserAccount(expert);

    res.status(201).json({
      success: true,
      message: 'Expert created successfully',
      data: expert,
    });
  } catch (error) {
    console.error('Create expert error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating expert',
    });
  }
};

// @desc    Update expert
// @route   PUT /api/experts/:id
// @access  Private/Admin
export const updateExpert = async (req, res) => {
  try {
    const { name, role, email, phone, accessCode } = req.body;
    const expert = await Expert.findByIdAndUpdate(
      req.params.id, 
      { name, role, email, phone, accessCode }, 
      { new: true, runValidators: true }
    );
    
    if (!expert) {
      return res.status(404).json({
        success: false,
        message: 'Expert not found',
      });
    }

    // Sync credentials
    await syncExpertUserAccount(expert);

    res.status(200).json({
      success: true,
      message: 'Expert updated successfully',
      data: expert,
    });
  } catch (error) {
    console.error('Update expert error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating expert',
    });
  }
};

// @desc    Delete expert
// @route   DELETE /api/experts/:id
// @access  Private/Admin
export const deleteExpert = async (req, res) => {
  try {
    const expert = await Expert.findByIdAndDelete(req.params.id);
    if (!expert) {
      return res.status(404).json({
        success: false,
        message: 'Expert not found',
      });
    }

    // Delete matching User credentials
    await User.deleteOne({ email: expert.email.toLowerCase() });

    res.status(200).json({
      success: true,
      message: 'Expert deleted successfully',
    });
  } catch (error) {
    console.error('Delete expert error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting expert',
    });
  }
};

// @desc    Get logged-in expert's inquiries
// @route   GET /api/experts/my-inquiries
// @access  Private/Expert
export const getMyExpertInquiries = async (req, res) => {
  try {
    const expert = await Expert.findOne({ email: req.user.email });
    if (!expert) {
      return res.status(404).json({
        success: false,
        message: 'Expert profile details not found',
      });
    }

    const inquiries = await Contact.find({ expert: expert._id }).sort('-createdAt');
    res.status(200).json({
      success: true,
      count: inquiries.length,
      data: inquiries,
    });
  } catch (error) {
    console.error('Get my expert inquiries error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching expert inquiries',
    });
  }
};

// @desc    Update status of an expert's inquiry
// @route   PUT /api/experts/inquiries/:id/status
// @access  Private/Expert
export const updateExpertInquiryStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['new', 'read', 'resolved'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value',
      });
    }

    const expert = await Expert.findOne({ email: req.user.email });
    if (!expert) {
      return res.status(404).json({
        success: false,
        message: 'Expert profile details not found',
      });
    }

    const inquiry = await Contact.findOne({ _id: req.params.id, expert: expert._id });
    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found or not assigned to you',
      });
    }

    inquiry.status = status;
    await inquiry.save();

    res.status(200).json({
      success: true,
      message: 'Inquiry status updated successfully',
      data: inquiry,
    });
  } catch (error) {
    console.error('Update expert inquiry status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating inquiry status',
    });
  }
};

// @desc    Approve a pending expert
// @route   PUT /api/experts/:id/approve
// @access  Private/Admin
export const approveExpert = async (req, res) => {
  try {
    const expert = await Expert.findById(req.params.id);
    if (!expert) {
      return res.status(404).json({
        success: false,
        message: 'Expert not found',
      });
    }

    expert.isApproved = true;
    await expert.save();

    // Find matching user and set isVerified: true
    const user = await User.findOne({ email: expert.email.toLowerCase() });
    if (user) {
      user.isVerified = true;
      await user.save({ validateBeforeSave: false });
    }

    res.status(200).json({
      success: true,
      message: 'Expert approved successfully',
      data: expert,
    });
  } catch (error) {
    console.error('Approve expert error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during expert approval',
    });
  }
};
