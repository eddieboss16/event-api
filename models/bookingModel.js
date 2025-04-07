const db = require('../config/db');

const Booking = {
  async create({ user_id, event_id }) {
    const [result] = await db.execute(
      'INSERT INTO bookings (user_id, event_id) VALUES (?, ?)',
      [user_id, event_id]
    );
    return result.insertId;
  },

  async updatePaymentStatus(id, status, ticketUrl) {
    await db.execute(
      'UPDATE bookings SET payment_status = ?, ticket_url = ? WHERE id = ?',
      [status, ticketUrl, id]
    );
  },

  async getReports() {
    const [rows] = await db.execute(`
      SELECT 
        e.id, 
        e.title,
        COUNT(b.id) as total_bookings,
        SUM(e.price) as total_income
      FROM events e
      LEFT JOIN bookings b ON e.id = b.event_id
      WHERE b.payment_status = 'paid'
      GROUP BY e.id, e.title
    `);
    return rows;
  }
};

module.exports = Booking;