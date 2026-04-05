const router = require('express').Router();
const { getDashboard } = require('../controllers/analyticsController');
const { auth, adminOnly } = require('../middleware/auth');

router.get('/dashboard', auth, adminOnly, getDashboard);

module.exports = router;
