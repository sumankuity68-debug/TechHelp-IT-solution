import Testimonial from '../models/testimonial.js';

// Auto-seed data
const seedDefaultTestimonials = async () => {
  const defaults = [
    {
      name: 'Arjun Mehta',
      role: 'CEO, LaunchBridge',
      project: 'Cloud Dashboard Integration',
      rating: 5,
      text: 'TechHelp IT Solutions delivered our cloud dashboard in 6 weeks flat. The containerized configuration and API quality were exceptional. Our internal systems run flawlessly now.',
      likes: 12,
      dislikes: 0,
      replies: [
        { name: 'TechHelp Admin', text: 'Thank you Arjun! It was a pleasure collaborating on your cloud infrastructure.' }
      ]
    },
    {
      name: 'Priya Sharma',
      role: 'Founder, StyleVault',
      project: 'E-commerce Migration',
      rating: 5,
      text: 'Our analytics throughput increased by 40% and server overhead dropped significantly after TechHelp migrated our architecture. Their team has true enterprise capabilities.',
      likes: 8,
      dislikes: 1,
      replies: []
    },
    {
      name: 'Rahul Banerjee',
      role: 'CTO, FinTrack',
      project: 'Microservices & Database Tuning',
      rating: 5,
      text: 'The distributed transaction API they designed handles high volumes with zero lag. Excellent database tuning, clean microservices interface. These guys understand systems engineering.',
      likes: 15,
      dislikes: 0,
      replies: []
    }
  ];

  await Testimonial.insertMany(defaults);
};

// @desc    Get all testimonials (seeds default list if empty)
// @route   GET /api/testimonials
// @access  Public
export const getTestimonials = async (req, res) => {
  try {
    let count = await Testimonial.countDocuments();
    if (count === 0) {
      await seedDefaultTestimonials();
    }
    const testimonials = await Testimonial.find()
      .populate('user', 'name email avatar role')
      .sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: testimonials.length,
      data: testimonials,
    });
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({ success: false, message: 'Server error fetching testimonials' });
  }
};

// @desc    Submit a new rating / testimonial
// @route   POST /api/testimonials
// @access  Private
export const createTestimonial = async (req, res) => {
  try {
    const { name, role, project, rating, text } = req.body;

    if (!name || !rating || !text) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a name, rating, and review text',
      });
    }

    const testimonial = await Testimonial.create({
      user: req.user._id,
      name,
      role: role || 'Client',
      project: project || 'General Consultation',
      rating,
      text,
    });

    res.status(201).json({
      success: true,
      data: testimonial,
    });
  } catch (error) {
    console.error('Error creating testimonial:', error);
    res.status(500).json({ success: false, message: 'Server error creating testimonial' });
  }
};

// @desc    Like a testimonial
// @route   PUT /api/testimonials/:id/like
// @access  Public
export const likeTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );

    if (!testimonial) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }

    res.status(200).json({
      success: true,
      data: testimonial,
    });
  } catch (error) {
    console.error('Error liking testimonial:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Dislike a testimonial
// @route   PUT /api/testimonials/:id/dislike
// @access  Public
export const dislikeTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      { $inc: { dislikes: 1 } },
      { new: true }
    );

    if (!testimonial) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }

    res.status(200).json({
      success: true,
      data: testimonial,
    });
  } catch (error) {
    console.error('Error disliking testimonial:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Reply to a testimonial
// @route   POST /api/testimonials/:id/reply
// @access  Public
export const replyTestimonial = async (req, res) => {
  try {
    const { name, text } = req.body;

    if (!name || !text) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a name and reply text',
      });
    }

    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }

    testimonial.replies.push({ name, text });
    await testimonial.save();

    res.status(200).json({
      success: true,
      data: testimonial,
    });
  } catch (error) {
    console.error('Error replying to testimonial:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Vote on a testimonial (adjust likes/dislikes counters dynamically)
// @route   PUT /api/testimonials/:id/vote
// @access  Public
export const voteTestimonial = async (req, res) => {
  try {
    const { currentVote, previousVote } = req.body;
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }

    let likesAdjustment = 0;
    let dislikesAdjustment = 0;

    // Undo previous vote impact
    if (previousVote === 'like') {
      likesAdjustment -= 1;
    } else if (previousVote === 'dislike') {
      dislikesAdjustment -= 1;
    }

    // Apply current vote impact
    if (currentVote === 'like') {
      likesAdjustment += 1;
    } else if (currentVote === 'dislike') {
      dislikesAdjustment += 1;
    }

    // Update counts (prevent negative values)
    testimonial.likes = Math.max(0, testimonial.likes + likesAdjustment);
    testimonial.dislikes = Math.max(0, testimonial.dislikes + dislikesAdjustment);

    await testimonial.save();

    res.status(200).json({
      success: true,
      data: testimonial,
    });
  } catch (error) {
    console.error('Error voting on testimonial:', error);
    res.status(500).json({ success: false, message: 'Server error voting on testimonial' });
  }
};

// @desc    Update a testimonial
// @route   PUT /api/testimonials/:id
// @access  Private
export const updateTestimonial = async (req, res) => {
  try {
    const { name, role, project, rating, text } = req.body;
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }

    // Check if user is the owner
    if (!testimonial.user || testimonial.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to edit this testimonial',
      });
    }

    // Update testimonial fields
    testimonial.name = name || testimonial.name;
    testimonial.role = role || testimonial.role;
    testimonial.project = project || testimonial.project;
    testimonial.rating = rating || testimonial.rating;
    testimonial.text = text || testimonial.text;

    await testimonial.save();

    res.status(200).json({
      success: true,
      data: testimonial,
    });
  } catch (error) {
    console.error('Error updating testimonial:', error);
    res.status(500).json({ success: false, message: 'Server error updating testimonial' });
  }
};

// @desc    Delete a testimonial
// @route   DELETE /api/testimonials/:id
// @access  Private/Admin/Owner
export const deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }

    // Check authorization: Admin OR Owner
    const isAdmin = req.user && req.user.role === 'admin';
    const isOwner = testimonial.user && testimonial.user.toString() === req.user._id.toString();

    if (!isAdmin && !isOwner) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this testimonial',
      });
    }

    await Testimonial.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Testimonial deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    res.status(500).json({ success: false, message: 'Server error deleting testimonial' });
  }
};

// @desc    Delete a reply from a testimonial
// @route   DELETE /api/testimonials/:id/reply/:replyId
// @access  Private/Admin
export const deleteReply = async (req, res) => {
  try {
    const { id, replyId } = req.params;
    const testimonial = await Testimonial.findById(id);

    if (!testimonial) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }

    // Filter out the reply to delete
    testimonial.replies = testimonial.replies.filter(
      (reply) => reply._id.toString() !== replyId
    );

    await testimonial.save();

    res.status(200).json({
      success: true,
      message: 'Reply deleted successfully',
      data: testimonial,
    });
  } catch (error) {
    console.error('Error deleting reply:', error);
    res.status(500).json({ success: false, message: 'Server error deleting reply' });
  }
};
