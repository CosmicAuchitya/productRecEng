const Booking = require('../models/Booking');
const Review = require('../models/Review');
const MenuItem = require('../models/MenuItem');
const Category = require('../models/Category');

exports.getDashboard = async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const cancelledBookings = await Booking.countDocuments({ status: 'cancelled' });
    const noShowBookings = await Booking.countDocuments({ status: 'no-show' });

    const revenueResult = await Booking.aggregate([
      { $match: { payment_status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$amount_paid' } } }
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    const totalMenuItems = await MenuItem.countDocuments();
    const totalCategories = await Category.countDocuments({ isActive: true });

    const pendingReviews = await Review.countDocuments({ isApproved: false });
    const approvedReviews = await Review.countDocuments({ isApproved: true });

    // Recent bookings
    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(10);

    // Revenue last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const dailyRevenue = await Booking.aggregate([
      { $match: { payment_status: 'paid', createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$amount_paid' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Today's bookings
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const todaysBookings = await Booking.countDocuments({
      date: { $gte: today, $lt: tomorrow },
      status: { $in: ['confirmed', 'pending'] }
    });

    res.json({
      stats: {
        totalBookings, confirmedBookings, pendingBookings,
        cancelledBookings, noShowBookings, totalRevenue,
        totalMenuItems, totalCategories,
        pendingReviews, approvedReviews, todaysBookings
      },
      recentBookings,
      dailyRevenue
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
