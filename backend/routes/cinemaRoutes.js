const express = require('express');
const router = express.Router();
const {
  getCinemas,
  getCinemaById,
  createCinema,
  updateCinema,
  deleteCinema
} = require('../controllers/cinemaController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', getCinemas);
router.get('/:id', getCinemaById);

// Admin protected routes
router.post('/', protect, adminOnly, createCinema);
router.put('/:id', protect, adminOnly, updateCinema);
router.delete('/:id', protect, adminOnly, deleteCinema);

module.exports = router;

