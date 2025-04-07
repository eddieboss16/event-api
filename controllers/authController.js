const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../services/emailService');

const register = async (req, res) => {
  const { name, email, password } = req.body;
  
  try {
    const existingUser = await User.findByEmail(email);
    if (existingUser) return res.status(400).json({ message: 'User exists' });

    const userId = await User.create({ name, email, password });
    const token = jwt.sign({ id: userId, email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    await sendEmail(email, 'Verify Email', `Click to verify: http://localhost:3000/api/auth/verify-email?token=${token}`);
    res.status(201).json({ message: 'User created, please verify email' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await User.findByEmail(email);
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    if (!user.is_verified) return res.status(403).json({ message: 'Email not verified' });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, redirect: user.role === 'admin' ? '/admin/dashboard' : '/user/dashboard' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const verifyEmail = async (req, res) => {
  const { token } = req.query;
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    await User.updateVerification(decoded.id);
    res.json({ message: 'Email verified' });
  } catch (error) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  
  try {
    const user = await User.findByEmail(email);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    await sendEmail(email, 'Reset Password', `Reset link: http://localhost:3000/api/auth/reset-password?token=${token}`);
    res.json({ message: 'Reset link sent' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const resetPassword = async (req, res) => {
  const { token, password } = req.body;
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.execute('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, decoded.id]);
    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

module.exports = { register, login, verifyEmail, forgotPassword, resetPassword };