const User = require('../models/User');

exports.register = async (req, res) => {
    try {
        const { email, password, name } = req.body;
        const user = new User({ email, password, name });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.login = (req, res) => {
    const userResponse = {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        watchlist: req.user.watchlist,
        seenlist: req.user.seenlist
    };
    res.json({ user: userResponse });
};

exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) { return res.status(500).json({ message: 'Error logging out' }); }
        res.json({ message: 'Logged out successfully' });
    });
};