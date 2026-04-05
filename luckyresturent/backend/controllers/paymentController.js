const crypto = require('crypto');
const razorpay = require('../config/razorpay');
const Booking = require('../models/Booking');

const ADVANCE_AMOUNT = parseInt(process.env.ADVANCE_BOOKING_AMOUNT) || 200;

exports.createOrder = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    const options = {
      amount: ADVANCE_AMOUNT * 100,
      currency: 'INR',
      receipt: `booking_${bookingId}`,
      notes: {
        bookingId: bookingId,
        customerName: booking.name,
        date: booking.date.toISOString(),
        time: booking.time,
        guests: booking.guests.toString()
      }
    };

    const order = await razorpay.orders.create(options);
    booking.order_id = order.id;
    await booking.save();

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      bookingId: booking._id,
      keyId: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    res.status(500).json({ message: 'Payment order creation failed', error: error.message });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;

    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    const isValid = expectedSignature === razorpay_signature;

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    if (isValid) {
      booking.payment_status = 'paid';
      booking.payment_id = razorpay_payment_id;
      booking.razorpay_signature = razorpay_signature;
      booking.amount_paid = ADVANCE_AMOUNT;
      booking.status = 'confirmed';
      await booking.save();

      res.json({
        success: true,
        booking,
        message: 'Payment verified! Your table is confirmed.',
        arrivalWindow: `Please arrive between ${booking.time} - ${booking.arrivalWindowEnd}. Late arrival will result in booking cancellation with no refund.`
      });
    } else {
      booking.payment_status = 'failed';
      await booking.save();
      res.status(400).json({ success: false, message: 'Payment verification failed' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Payment verification error', error: error.message });
  }
};

exports.handleWebhook = async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (webhookSecret) {
      const shasum = crypto.createHmac('sha256', webhookSecret);
      shasum.update(JSON.stringify(req.body));
      const digest = shasum.digest('hex');
      if (digest !== req.headers['x-razorpay-signature']) {
        return res.status(400).json({ message: 'Invalid webhook signature' });
      }
    }

    const event = req.body.event;
    const payment = req.body.payload?.payment?.entity;

    if (event === 'payment.captured' && payment) {
      const booking = await Booking.findOne({ order_id: payment.order_id });
      if (booking && booking.payment_status !== 'paid') {
        booking.payment_status = 'paid';
        booking.payment_id = payment.id;
        booking.amount_paid = payment.amount / 100;
        booking.status = 'confirmed';
        await booking.save();
      }
    }

    res.json({ status: 'ok' });
  } catch (error) {
    res.status(500).json({ message: 'Webhook error' });
  }
};
