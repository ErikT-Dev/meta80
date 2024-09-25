const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { isAuthenticated } = require('../middleware/auth');

router.post('/toggle-watchlist', isAuthenticated, userController.toggleWatchlist);
router.post('/toggle-seenlist', isAuthenticated, userController.toggleSeenlist);

module.exports = router;