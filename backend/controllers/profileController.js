const User = require('../models/User');
const Auction = require('../models/Auction');


// Fetch user profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password') // Exclude password
      .populate('watchlist'); // Populate watchlist

    // Fetch auctions won by the user
    const wonAuctions = await Auction.find({ winner: req.user._id })
      .populate('owner', 'email')
      .populate('bids.user', 'email');

    res.json({ user, wonAuctions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.email = req.body.email || user.email;

      if (req.body.password) {
        user.password = await bcrypt.hash(req.body.password, 8);
      }

      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        email: updatedUser.email,
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// Upload profile photo

const upload = require('../middleware/upload'); // Import the upload middleware

// Upload profile photo
exports.uploadProfilePhoto = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Handle image upload
    let imagePath = '';
    if (req.file) {
      imagePath = req.file.path; // Save the file path
      console.log("Profile image uploaded:", imagePath); // Debugging: Log the image path
    } else {
      console.log("No profile image uploaded"); // Debugging: Log if no image is uploaded
    }

    // Update the user's profile picture
    user.profilePicture = imagePath; // Save the image path
    await user.save();

    console.log("Profile updated:", user); // Debugging: Log the updated user
    res.json({ profilePicture: user.profilePicture });
  } catch (err) {
    console.error("Error uploading profile photo:", err); // Debugging: Log the error
    res.status(500).json({ error: err.message });
  }
};
