const express = require('express');
const router = express.Router();
const {
  getShowtimes,
  getShowtimeById,
  createShowtime,
  deleteShowtime
} = require('../controllers/showtimeController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', getShowtimes);
router.get('/:id', getShowtimeById);

// Admin protected routes
router.post('/', protect, adminOnly, createShowtime);
router.delete('/:id', protect, adminOnly, deleteShowtime);

module.exports = router;

