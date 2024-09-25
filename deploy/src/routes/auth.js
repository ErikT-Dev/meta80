const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', passport.authenticate('local'), authController.login);
router.get('/logout', authController.logout);
router.get('/check-session', (req, res) => {
    if (req.isAuthenticated()) {
        res.json(req.user);
    } else {
        res.status(401).json({ message: 'Session expired' });
    }
});

module.exports = router;