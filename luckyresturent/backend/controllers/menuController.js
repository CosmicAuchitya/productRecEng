const Category = require('../models/Category');
const MenuItem = require('../models/MenuItem');

const validateDiscount = (discountType, discountValue, priceFull) => {
  if (!discountType || discountType === 'none') return;
  if (discountType === 'percentage' && discountValue > 20) {
    throw new Error('Percentage discount cannot exceed 20% for security reasons.');
  }
  if (discountType === 'flat') {
    const maxAllowed = priceFull * 0.20;
    if (discountValue > maxAllowed) {
      throw new Error(`Flat discount cannot exceed 20% of the price (Max allowed: ₹${maxAllowed})`);
    }
  }
};

// ===== CATEGORIES =====
exports.getCategories = async (req, res) => {
  try {
    const filter = req.query.all === 'true' ? {} : { isActive: true };
    const categories = await Category.find(filter).sort({ order: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name, description, image, order } = req.body;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const existing = await Category.findOne({ slug });
    if (existing) return res.status(400).json({ message: 'Category already exists' });

    const category = await Category.create({ name, slug, description, image, order });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true
    });
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    await MenuItem.deleteMany({ category: req.params.id });
    res.json({ message: 'Category and its items deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ===== MENU ITEMS =====
exports.getMenuItems = async (req, res) => {
  try {
    const { category, search, veg, available } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (veg === 'true') filter.isVeg = true;
    if (available !== 'false') filter.isAvailable = true;
    if (search) filter.name = { $regex: search, $options: 'i' };

    const items = await MenuItem.find(filter).populate('category', 'name slug').sort({ category: 1, name: 1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getMenuByCategory = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ order: 1 });
    const menu = [];

    for (const cat of categories) {
      const items = await MenuItem.find({ category: cat._id, isAvailable: true }).sort({ name: 1 });
      if (items.length > 0) {
        menu.push({ category: cat, items });
      }
    }

    res.json(menu);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.createMenuItem = async (req, res) => {
  try {
    const { discountType, discountValue, priceFull } = req.body;
    validateDiscount(discountType, discountValue, priceFull);

    const item = await MenuItem.create(req.body);
    const populated = await item.populate('category', 'name slug');
    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ message: 'Validation error', error: error.message });
  }
};

exports.updateMenuItem = async (req, res) => {
  try {
    const { discountType, discountValue, priceFull } = req.body;
    validateDiscount(discountType, discountValue, priceFull);

    const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true
    }).populate('category', 'name slug');
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (error) {
    res.status(400).json({ message: 'Validation error', error: error.message });
  }
};

exports.deleteMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.toggleAvailability = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    item.isAvailable = !item.isAvailable;
    await item.save();
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
