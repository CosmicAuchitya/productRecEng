const router = require('express').Router();
const {
  getCategories, createCategory, updateCategory, deleteCategory,
  getMenuItems, getMenuByCategory, createMenuItem, updateMenuItem,
  deleteMenuItem, toggleAvailability
} = require('../controllers/menuController');
const { auth, adminOnly } = require('../middleware/auth');

// Public routes
router.get('/categories', getCategories);
router.get('/items', getMenuItems);
router.get('/grouped', getMenuByCategory);

// Admin routes
router.post('/categories', auth, adminOnly, createCategory);
router.put('/categories/:id', auth, adminOnly, updateCategory);
router.delete('/categories/:id', auth, adminOnly, deleteCategory);

router.post('/items', auth, adminOnly, createMenuItem);
router.put('/items/:id', auth, adminOnly, updateMenuItem);
router.delete('/items/:id', auth, adminOnly, deleteMenuItem);
router.patch('/items/:id/toggle', auth, adminOnly, toggleAvailability);

module.exports = router;
