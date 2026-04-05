const Review = require('../models/Review');

exports.getApprovedReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ isApproved: true }).sort({ createdAt: -1 });
    const total = reviews.length;
    const avgRating = total > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / total).toFixed(1)
      : 0;

    res.json({ reviews, total, avgRating: parseFloat(avgRating) });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getAllReviews = async (req, res) => {
  try {
    const { approved } = req.query;
    const filter = {};
    if (approved === 'true') filter.isApproved = true;
    if (approved === 'false') filter.isApproved = false;

    const reviews = await Review.find(filter).sort({ createdAt: -1 });
    const allApproved = await Review.find({ isApproved: true });
    const avgRating = allApproved.length > 0
      ? (allApproved.reduce((sum, r) => sum + r.rating, 0) / allApproved.length).toFixed(1)
      : 0;

    res.json({ reviews, total: reviews.length, avgRating: parseFloat(avgRating) });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.createReview = async (req, res) => {
  try {
    const { name, email, rating, comment } = req.body;
    if (!name || !rating || !comment) {
      return res.status(400).json({ message: 'Name, rating, and comment are required' });
    }

    const review = await Review.create({ name, email, rating, comment, isApproved: false });
    res.status(201).json({
      review,
      message: 'Thank you for your review! It will appear after admin approval.'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.approveReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json({ message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
