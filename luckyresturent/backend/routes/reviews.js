const router = require('express').Router();
const {
  getApprovedReviews, getAllReviews, createReview,
  approveReview, deleteReview
} = require('../controllers/reviewController');
const { auth, adminOnly } = require('../middleware/auth');

router.get('/', getApprovedReviews);
router.post('/', createReview);
router.get('/all', auth, adminOnly, getAllReviews);
router.put('/:id/approve', auth, adminOnly, approveReview);
router.delete('/:id', auth, adminOnly, deleteReview);

module.exports = router;
