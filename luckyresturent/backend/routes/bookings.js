const router = require('express').Router();
const {
  createBooking, getBookings, getBookingById,
  updateBookingStatus, markNoShow, processRefund, getAdvanceAmount
} = require('../controllers/bookingController');
const { auth, adminOnly } = require('../middleware/auth');

// Public
router.post('/', createBooking);
router.get('/advance-info', getAdvanceAmount);
router.get('/:id', getBookingById);

// Admin
router.get('/', auth, adminOnly, getBookings);
router.put('/:id/status', auth, adminOnly, updateBookingStatus);
router.put('/:id/no-show', auth, adminOnly, markNoShow);
router.put('/:id/refund', auth, adminOnly, processRefund);

module.exports = router;
