const Booking = require('../models/bookingModel');
const Event = require('../models/eventModel');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { sendEmail } = require('../services/emailService');
const { generateTicket } = require('../utils/ticketGenerator');

const bookEvent = async (req, res) => {
  const { event_id } = req.body;
  
  try {
    const event = await Event.findById(event_id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const bookingId = await Booking.create({ user_id: req.user.id, event_id });
    res.json({ bookingId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const processPayment = async (req, res) => {
  const { bookingId, paymentMethodId } = req.body;
  
  try {
    const [booking] = await db.execute('SELECT * FROM bookings WHERE id = ?', [bookingId]);
    const event = await Event.findById(booking[0].event_id);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: event.price * 100, // in cents
      currency: 'usd',
      payment_method: paymentMethodId,
      confirmation_method: 'manual',
      confirm: true,
    });

    if (paymentIntent.status === 'succeeded') {
      const ticketPath = await generateTicket(bookingId, event, req.user);
      await Booking.updatePaymentStatus(bookingId, 'paid', ticketPath);
      await sendEmail(req.user.email, 'Your Event Ticket', 'See attached ticket', ticketPath);
      res.json({ message: 'Payment successful, ticket sent' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getReports = async (req, res) => {
  try {
    const reports = await Booking.getReports();
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { bookEvent, processPayment, getReports };