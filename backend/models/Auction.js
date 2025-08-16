const mongoose = require('mongoose');

const auctionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  startingBid: { type: Number, required: true },
  currentBid: { type: Number, required: true },
  endTime: { type: Date, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bids: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    amount: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now }
  }],
  winner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['active', 'ended'], default: 'active' },
  image: { type: String }, // Auction image
  comments: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
  }]
});

module.exports = mongoose.model('Auction', auctionSchema);
