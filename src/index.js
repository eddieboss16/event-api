const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const db = require('./config/db'); // Import the database pool

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/bookings', bookingRoutes);

// Test database connection
db.getConnection()
  .then((connection) => {
    console.log('Database connected successfully');
    connection.release(); // Release the connection back to the pool
  })
  .catch((error) => {
    console.error('Database connection failed:', error.message);
    process.exit(1); // Exit the process if the database connection fails
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});