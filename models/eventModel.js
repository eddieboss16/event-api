const db = require('../config/db');

const Event = {
  async create({ title, description, price, date, capacity, created_by }) {
    const [result] = await db.execute(
      'INSERT INTO events (title, description, price, date, capacity, created_by) VALUES (?, ?, ?, ?, ?, ?)',
      [title, description, price, date, capacity, created_by]
    );
    return result.insertId;
  },

  async findAll() {
    const [rows] = await db.execute('SELECT * FROM events');
    return rows;
  },

  async findById(id) {
    const [rows] = await db.execute('SELECT * FROM events WHERE id = ?', [id]);
    return rows[0];
  },

  async update(id, data) {
    const [result] = await db.execute(
      'UPDATE events SET title = ?, description = ?, price = ?, date = ?, capacity = ? WHERE id = ?',
      [data.title, data.description, data.price, data.date, data.capacity, id]
    );
    return result.affectedRows;
  },

  async delete(id) {
    const [result] = await db.execute('DELETE FROM events WHERE id = ?', [id]);
    return result.affectedRows;
  }
};

module.exports = Event;