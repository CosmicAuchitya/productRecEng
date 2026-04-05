const router = require('express').Router();
const { createOrder, verifyPayment, getAllOrders, getOrder, updateStatus } = require('../controllers/orderController');
const { auth, adminOnly } = require('../middleware/auth');

// Public
router.post('/', createOrder);
router.post('/verify', verifyPayment);
router.get('/:id', getOrder);

// Admin
router.get('/', auth, adminOnly, getAllOrders);
router.put('/:id/status', auth, adminOnly, updateStatus);

module.exports = router;
