const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { bookEvent, processPayment, getReports } = require('../controllers/bookingController');

router.post('/', authMiddleware(['user']), bookEvent);
router.post('/payment', authMiddleware(['user']), processPayment);
router.get('/reports', authMiddleware(['admin']), getReports);

module.exports = router;