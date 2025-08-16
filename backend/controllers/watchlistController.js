const User = require('../models/User');

exports.addToWatchlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user.watchlist.includes(req.params.itemId)) {
      user.watchlist.push(req.params.itemId);
      await user.save();
    }
    res.json(user.watchlist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getWatchlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('watchlist');
    res.json(user.watchlist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
