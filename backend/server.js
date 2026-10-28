const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Load environment variables
dotenv.config();

const app = express();

// Body parser & CORS
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Status / Healthcheck
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    appName: 'IMovies - Movie ticket booking made simple',
    dbStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Mount Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/movies', require('./routes/movieRoutes'));
app.use('/api/cinemas', require('./routes/cinemaRoutes'));
app.use('/api/showtimes', require('./routes/showtimeRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));

// Root endpoint info
app.get('/', (req, res) => {
  res.send('🎬 Welcome to IMovies RESTful API. Visit /api/movies to view movies.');
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Start HTTP server immediately
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 IMovies Backend running at http://localhost:${PORT}`);
  console.log(`🔗 API Base: http://localhost:${PORT}/api`);
});

// Connect DB asynchronously
connectDB().then(async () => {
  if (mongoose.connection.readyState === 1) {
    try {
      const Movie = require('./models/Movie');
      const movieCount = await Movie.countDocuments();
      if (movieCount === 0) {
        console.log('🌱 Database is empty. Seeding initial data...');
        const { seedDatabase } = require('./seeder/seedData');
        await seedDatabase();
      }
    } catch (e) {
      console.warn('Auto-seed check note:', e.message);
    }
  }
}).catch((err) => {
  console.warn('MongoDB connection note:', err.message);
});
