const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const Settings = require('../models/Settings');
const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// POST /api/orders - Place a new order (creates Razorpay order)
exports.createOrder = async (req, res) => {
  try {
    const { name, phone, email, items: clientItems, orderType, deliveryAddress, deliveryFee, specialInstructions, paymentMethod } = req.body;

    if (!clientItems || clientItems.length === 0) return res.status(400).json({ message: 'No items in order' });

    // HACKER PROTECTION: Server-side re-calculation
    let trueSubtotal = 0;
    let trueDiscount = 0;
    
    // Global Settings
    const settings = await Settings.findOne() || {};
    const globalType = settings.globalDiscountType;
    const globalValue = settings.globalDiscountValue || 0;

    const validatedItems = [];

    for (let cItem of clientItems) {
      const dbItem = await MenuItem.findById(cItem.menuItem);
      if (!dbItem) return res.status(400).json({ message: 'Invalid item found in cart' });
      
      const price = cItem.portion === 'half' ? dbItem.priceHalf : dbItem.priceFull;
      if (!price) return res.status(400).json({ message: 'Invalid portion selection' });

      // Apply Item Discount (strictly enforced 20% max logic)
      let itemDiscountValue = 0;
      if (dbItem.discountType === 'percentage') {
         const cappedPct = Math.min(dbItem.discountValue, 20);
         itemDiscountValue = price * (cappedPct / 100);
      } else if (dbItem.discountType === 'flat') {
         const maxFlat = price * 0.20;
         itemDiscountValue = Math.min(dbItem.discountValue, maxFlat);
      }
      
      trueSubtotal += (price * cItem.quantity);
      trueDiscount += (itemDiscountValue * cItem.quantity);

      validatedItems.push({
        menuItem: dbItem._id,
        name: dbItem.name,
        portion: cItem.portion,
        price: price, 
        quantity: cItem.quantity
      });
    }

    // Apply Global Discount (with 20% limit logic)
    if (globalType === 'percentage') {
       const cappedGlobalPct = Math.min(globalValue, 20);
       const globalDisc = trueSubtotal * (cappedGlobalPct / 100);
       trueDiscount += globalDisc;
    } else if (globalType === 'flat') {
       const maxGlobalFlat = trueSubtotal * 0.20;
       const globalDisc = Math.min(globalValue, maxGlobalFlat);
       trueDiscount += globalDisc;
    }

    const trueTotal = Math.max(0, trueSubtotal - trueDiscount) + (deliveryFee || 0);

    let razorpayOrder = null;

    if (paymentMethod === 'online') {
      try {
        // Create Razorpay order
        razorpayOrder = await razorpay.orders.create({
          amount: Math.round(trueTotal * 100),
          currency: 'INR',
          receipt: `order_${Date.now()}`,
          notes: { customer: name, phone }
        });
      } catch (err) {
        console.error('Razorpay Error:', err);
        return res.status(500).json({ message: 'Payment Gateway Error. Ensure Razorpay keys are set in .env' });
      }
    }

    // Save to DB using purely Server Computed Totals
    const order = await Order.create({
      name, phone, email, items: validatedItems, orderType,
      deliveryAddress: deliveryAddress || '',
      subtotal: trueSubtotal, deliveryFee: deliveryFee || 0,
      discount: trueDiscount, total: trueTotal,
      specialInstructions: specialInstructions || '',
      paymentMethod: paymentMethod || 'cod',
      order_id: razorpayOrder ? razorpayOrder.id : `COD_${Date.now()}`,
      payment_status: paymentMethod === 'cod' ? 'pending' : 'pending',
      status: paymentMethod === 'cod' ? 'confirmed' : 'pending' // COD is auto confirmed, online confirms after verify
    });

    if (paymentMethod === 'online' && razorpayOrder) {
      return res.status(201).json({
        success: true,
        order,
        razorpay: {
          key: process.env.RAZORPAY_KEY_ID,
          order_id: razorpayOrder.id,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency
        }
      });
    }

    // COD Response
    res.status(201).json({ success: true, order });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// POST /api/orders/verify - Verify Razorpay payment
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(sign).digest('hex');

    if (razorpay_signature !== expectedSign) {
      await Order.findByIdAndUpdate(orderId, { payment_status: 'failed' });
      return res.status(400).json({ message: 'Payment verification failed' });
    }

    const order = await Order.findByIdAndUpdate(orderId, {
      payment_status: 'paid',
      payment_id: razorpay_payment_id,
      razorpay_signature,
      status: 'confirmed',
      estimatedTime: 30
    }, { new: true });

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET /api/orders - Get all orders (admin)
exports.getAllOrders = async (req, res) => {
  try {
    const { status, limit = 50 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    const orders = await Order.find(filter).sort({ createdAt: -1 }).limit(Number(limit));
    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET /api/orders/:id - Get single order
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// PUT /api/orders/:id/status - Update order status (admin)
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
