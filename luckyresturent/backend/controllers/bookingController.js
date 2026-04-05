const Booking = require('../models/Booking');

const ADVANCE_AMOUNT = parseInt(process.env.ADVANCE_BOOKING_AMOUNT) || 200;

exports.createBooking = async (req, res) => {
  try {
    const { name, phone, email, date, time, guests, specialRequests } = req.body;

    if (!name || !phone || !date || !time || !guests) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    const bookingDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (bookingDate < today) {
      return res.status(400).json({ message: 'Cannot book for past dates' });
    }

    const booking = await Booking.create({
      name, phone, email, date: bookingDate, time, guests,
      specialRequests,
      amount_paid: ADVANCE_AMOUNT,
      payment_status: 'pending',
      status: 'pending'
    });

    res.status(201).json({
      booking,
      advanceAmount: ADVANCE_AMOUNT,
      message: `Advance payment of ₹${ADVANCE_AMOUNT} required to confirm booking`
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getBookings = async (req, res) => {
  try {
    const { status, payment_status, date, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (payment_status) filter.payment_status = payment_status;
    if (date) {
      const d = new Date(date);
      const next = new Date(d);
      next.setDate(next.getDate() + 1);
      filter.date = { $gte: d, $lt: next };
    }

    const total = await Booking.countDocuments(filter);
    const bookings = await Booking.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({ bookings, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { status, cancellationReason } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    booking.status = status;
    if (cancellationReason) booking.cancellationReason = cancellationReason;

    if (status === 'cancelled' && booking.payment_status === 'paid') {
      booking.refundStatus = 'requested';
    }

    await booking.save();
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.markNoShow = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    booking.status = 'no-show';
    booking.cancellationReason = 'Guest did not arrive within the 30-minute arrival window. No refund applicable.';
    booking.refundStatus = 'denied';
    await booking.save();

    res.json({ booking, message: 'Booking marked as no-show. No refund will be issued.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.processRefund = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    if (booking.status === 'no-show') {
      return res.status(400).json({ message: 'No refund for no-show bookings' });
    }

    booking.refundStatus = 'processed';
    booking.payment_status = 'refunded';
    await booking.save();

    res.json({ booking, message: 'Refund processed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getAdvanceAmount = (req, res) => {
  res.json({
    amount: ADVANCE_AMOUNT,
    arrivalWindowMinutes: parseInt(process.env.ARRIVAL_WINDOW_MINUTES) || 30,
    policy: `Advance booking fee is ₹${ADVANCE_AMOUNT}. Guests must arrive within 30 minutes of booked time. No refund for no-shows.`
  });
};
