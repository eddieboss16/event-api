const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getEvents, createEvent, updateEvent, deleteEvent } = require('../controllers/eventController');

// Public route: Get all events
router.get('/', getEvents);

// Admin-only routes
router.post('/', authMiddleware(['admin']), createEvent); // Create an event
router.put('/:id', authMiddleware(['admin']), updateEvent); // Update an event
router.delete('/:id', authMiddleware(['admin']), deleteEvent); // Delete an event

module.exports = router;