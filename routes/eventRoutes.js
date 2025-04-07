const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getEvents, createEvent, updateEvent, deleteEvent } = require('../controllers/eventController');

router.get('/', getEvents);
router.post('/', authMiddleware(['admin']), createEvent);
router.put('/:id', authMiddleware(['admin']), updateEvent);
router.delete('/:id', authMiddleware(['admin']), deleteEvent);

module.exports = router;