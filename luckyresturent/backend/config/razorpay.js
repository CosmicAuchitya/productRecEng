const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_example123456',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'test_secret_example123456'
});

module.exports = razorpay;
