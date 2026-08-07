const EventRequest = require('../models/EventRequest');

// Helper function to check if selected date is in the past
const isPastDate = (dateStr) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const selectedDate = new Date(dateStr);
  selectedDate.setHours(0, 0, 0, 0);
  
  return selectedDate < today;
};

// @desc    Submit new event request
// @route   POST /api/events/request
// @access  Public
const submitEventRequest = async (req, res) => {
  try {
    const { name, email, phone, date, guests, eventType, venue, dietary, message } = req.body;

    // 1. Required fields check
    if (!name || !email || !phone || !date || !guests || !eventType || !venue) {
      return res.status(400).json({ message: 'All required fields must be filled.' });
    }

    // 2. Guest count validation
    const guestCount = Number(guests);
    if (isNaN(guestCount) || guestCount <= 0) {
      return res.status(400).json({ message: 'Expected guests must be more than 0.' });
    }

    // 3. Phone validation (must be valid)
    const phoneRegex = /^[+]?[0-9\s\-()]{10,20}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ message: 'Please enter a valid phone number.' });
    }

    // 4. Date validation: past date blocked
    if (isPastDate(date)) {
      return res.status(400).json({ message: 'Please select a valid future event date.' });
    }

    // 5. Prevent double booking venue for confirmed events
    const existingConfirmed = await EventRequest.findOne({
      venue,
      date,
      status: 'Confirmed'
    });

    if (existingConfirmed) {
      return res.status(400).json({ message: 'This venue is already booked for selected date.' });
    }

    const eventReq = await EventRequest.create({
      name,
      email,
      phone,
      date,
      guests: guestCount,
      eventType,
      venue,
      dietary: dietary || '',
      message: message || '',
      status: 'Pending'
    });

    res.status(201).json(eventReq);
  } catch (error) {
    console.error('Error submitting event request:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all event requests (Admin)
// @route   GET /api/events/requests
// @access  Private/Admin
const getAllEventRequests = async (req, res) => {
  try {
    const requests = await EventRequest.find({}).sort('-createdAt');
    res.json(requests);
  } catch (error) {
    console.error('Error fetching event requests:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update event request status (Admin)
// @route   PUT /api/events/requests/:id/status
// @access  Private/Admin
const updateEventRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    if (!['Pending', 'Contacted', 'Confirmed', 'Cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value.' });
    }

    const request = await EventRequest.findById(id);
    if (!request) {
      return res.status(404).json({ message: 'Event request not found.' });
    }

    // Prevent double booking venue for confirmed events
    if (status === 'Confirmed') {
      const existingConfirmed = await EventRequest.findOne({
        _id: { $ne: id },
        venue: request.venue,
        date: request.date,
        status: 'Confirmed'
      });

      if (existingConfirmed) {
        return res.status(400).json({ message: 'This venue is already booked for selected date.' });
      }
    }

    request.status = status;
    await request.save();

    res.json(request);
  } catch (error) {
    console.error('Error updating event request status:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete event request (Admin)
// @route   DELETE /api/events/requests/:id
// @access  Private/Admin
const deleteEventRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await EventRequest.findById(id);
    if (!request) {
      return res.status(404).json({ message: 'Event request not found.' });
    }

    await request.deleteOne();
    res.json({ message: 'Event request deleted successfully.' });
  } catch (error) {
    console.error('Error deleting event request:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  submitEventRequest,
  getAllEventRequests,
  updateEventRequestStatus,
  deleteEventRequest
};
