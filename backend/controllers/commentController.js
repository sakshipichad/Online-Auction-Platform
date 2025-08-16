const Auction = require('../models/Auction');

// Add a comment to an auction
exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const auctionId = req.params.auctionId;
    const userId = req.user._id;

    const auction = await Auction.findById(auctionId);
    if (!auction) {
      return res.status(404).json({ error: 'Auction not found' });
    }

    // Add the comment
    auction.comments.push({
      user: userId,
      text,
    });

    await auction.save();
    res.json(auction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all comments for an auction
exports.getComments = async (req, res) => {
  try {
    const auctionId = req.params.auctionId;

    const auction = await Auction.findById(auctionId).populate('comments.user', 'email');
    if (!auction) {
      return res.status(404).json({ error: 'Auction not found' });
    }

    res.json(auction.comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

