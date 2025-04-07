const Event = require('../models/eventModel');

// Get all events (public)
const getEvents = async (req, res) => {
  try {
    const events = await Event.findAll();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create an event (admin only)
const createEvent = async (req, res) => {
  const eventData = { ...req.body, created_by: req.user.id };
  
  try {
    const eventId = await Event.create(eventData);
    res.status(201).json({ id: eventId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an event (admin only)
const updateEvent = async (req, res) => {
  try {
    const updated = await Event.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Event not found' });
    res.json({ message: 'Event updated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete an event (admin only)
const deleteEvent = async (req, res) => {
  try {
    const deleted = await Event.delete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Event not found' });
    res.json({ message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getEvents, createEvent, updateEvent, deleteEvent };