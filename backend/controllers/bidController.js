const Auction = require('../models/Auction');

exports.placeBid = async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.auctionId);
    if (!auction) return res.status(404).json({ error: 'Auction not found' });

    if (req.body.amount <= auction.currentBid) {
      return res.status(400).json({ error: 'Bid must be higher than current bid' });
    }

    auction.bids.push({
      user: req.user._id,
      amount: req.body.amount
    });
    
    auction.currentBid = req.body.amount;
    await auction.save();
    
    res.json(auction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
