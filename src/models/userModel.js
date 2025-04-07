const db = require('../config/db');
const bcrypt = require('bcryptjs');

const User = {
  async create({ name, email, password, role }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.execute(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role || 'user']
    );
    return result.insertId;
  },

  async findByEmail(email) {
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  },

  async updateVerification(id) {
    await db.execute('UPDATE users SET is_verified = TRUE WHERE id = ?', [id]);
  }
};

module.exports = User;