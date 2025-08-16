const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: { type: String, default: 'https://via.placeholder.com/150' }, // Default profile picture
  watchlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Auction' }],
  notifications: [{
    message: String,
    read: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
  }],
  joinedAt: { type: Date, default: Date.now } // Track when the user joined
});

userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

module.exports = mongoose.model('User', userSchema);