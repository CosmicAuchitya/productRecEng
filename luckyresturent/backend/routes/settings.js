const router = require('express').Router();
const { getSettings, updateSettings } = require('../controllers/settingsController');
const { auth, adminOnly } = require('../middleware/auth');

router.get('/', getSettings);
router.put('/', auth, adminOnly, updateSettings);

module.exports = router;
