const User = require('../models/User');

exports.toggleWatchlist = async (req, res) => {
    const { movieId } = req.body;
    const userId = req.user._id;

    try {
        const user = await User.findById(userId);
        const index = user.watchlist.indexOf(movieId);

        if (index > -1) {
            user.watchlist.splice(index, 1);
        } else {
            user.watchlist.push(movieId);
        }

        await user.save();

        res.json({ watchlist: user.watchlist });
    } catch (error) {
        res.status(500).json({ message: 'Error updating watchlist', error: error.message });
    }
};

exports.toggleSeenlist = async (req, res) => {
    const { movieId } = req.body;
    const userId = req.user._id;

    try {
        const user = await User.findById(userId);
        const index = user.seenlist.indexOf(movieId);

        if (index > -1) {
            user.seenlist.splice(index, 1);
        } else {
            user.seenlist.push(movieId);
        }

        await user.save();

        res.json({ seenlist: user.seenlist });
    } catch (error) {
        res.status(500).json({ message: 'Error updating seenlist', error: error.message });
    }
};