const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const email = 'luckyresturent07@gmail.com';
    const existingAdmin = await User.findOne({ email });

    if (existingAdmin) {
      console.log('Admin already exists.');
      // Update password just in case it changed
      existingAdmin.password = 'sentry123';
      await existingAdmin.save();
      console.log('Admin password overwritten successfully.');
    } else {
      const admin = new User({
        name: 'Lucky Owner',
        email,
        password: 'sentry123',
        role: 'admin'
      });
      await admin.save();
      console.log('New admin seeded successfully.');
    }

    mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
