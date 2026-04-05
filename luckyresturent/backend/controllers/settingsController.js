const Settings = require('../models/Settings');

exports.getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const { globalDiscountType, globalDiscountValue } = req.body;

    if (globalDiscountType === 'percentage' && globalDiscountValue > 20) {
      return res.status(400).json({ message: 'Global percentage discount cannot exceed 20%' });
    }

    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
    }
    
    settings.globalDiscountType = globalDiscountType;
    settings.globalDiscountValue = globalDiscountValue || 0;
    
    await settings.save();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
