import Meeting from '../models/meeting.js';

// @desc    Create a new meeting
// @route   POST /api/meetings
// @access  Private (User, Expert, Admin)
export const createMeeting = async (req, res) => {
  try {
    const { topic, date, time } = req.body;

    if (!topic || !date || !time) {
      return res.status(400).json({ success: false, message: 'Please provide topic, date, and time.' });
    }

    const meeting = await Meeting.create({
      user: req.user.id,
      topic,
      date,
      time,
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      message: 'Meeting requested successfully',
      meeting,
    });
  } catch (error) {
    console.error('Create meeting error:', error);
    res.status(500).json({ success: false, message: 'Server error creating meeting' });
  }
};

// @desc    Get logged in user's meetings
// @route   GET /api/meetings/my-meetings
// @access  Private
export const getMyMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find({ user: req.user.id }).sort('-createdAt');
    res.status(200).json({ success: true, meetings });
  } catch (error) {
    console.error('Get my meetings error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching meetings' });
  }
};

// @desc    Get all meetings (Admin only)
// @route   GET /api/meetings
// @access  Private/Admin
export const getAllMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find().populate('user', 'name email').sort('-createdAt');
    res.status(200).json({ success: true, meetings });
  } catch (error) {
    console.error('Get all meetings error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching meetings' });
  }
};

// @desc    Update meeting status/link (Admin only)
// @route   PUT /api/meetings/:id
// @access  Private/Admin
export const updateMeeting = async (req, res) => {
  try {
    const { status, meetingLink, notes } = req.body;
    let meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
      return res.status(404).json({ success: false, message: 'Meeting not found' });
    }

    meeting.status = status || meeting.status;
    meeting.meetingLink = meetingLink !== undefined ? meetingLink : meeting.meetingLink;
    meeting.notes = notes !== undefined ? notes : meeting.notes;

    await meeting.save();

    res.status(200).json({ success: true, message: 'Meeting updated successfully', meeting });
  } catch (error) {
    console.error('Update meeting error:', error);
    res.status(500).json({ success: false, message: 'Server error updating meeting' });
  }
};
