const Auction = require('../models/Auction');
const upload = require('../middleware/upload'); // Import the upload middleware



// Get all auctions with search and filters
exports.getAllAuctions = async (req, res) => {
  try {
    const { search, status, minBid, maxBid } = req.query;

    // Build the query object
    const query = {};

    // Search by title or description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } }, // Case-insensitive search
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by bid range
    if (minBid || maxBid) {
      query.currentBid = {};
      if (minBid) query.currentBid.$gte = Number(minBid); // Greater than or equal to minBid
      if (maxBid) query.currentBid.$lte = Number(maxBid); // Less than or equal to maxBid
    }

    // Fetch auctions based on the query
    const auctions = await Auction.find(query).populate('owner', 'email');
    res.json(auctions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Get a single auction by ID
exports.getAuction = async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id)
      .populate('owner', 'email') // Populate owner details
      .populate('bids.user', 'email') // Populate bidder details
      .populate('winner', 'email'); // Populate winner details

    if (!auction) {
      return res.status(404).json({ error: 'Auction not found' });
    }

    console.log('Auction fetched (before status check):', auction); // Debugging

    // Check if the auction has ended and no winner has been set
    if (auction.endTime < new Date() && auction.status === 'active') {
      console.log('Auction has ended. Updating status to ended...'); // Debugging
      auction.status = 'ended';
      await auction.save();
    }

    // Determine the winner if the auction has ended and no winner exists
    if (auction.status === 'ended' && !auction.winner && auction.bids.length > 0) {
      console.log('Determining winner...'); // Debugging

      // Find the highest bid
      const highestBid = auction.bids.reduce((prev, current) =>
        prev.amount > current.amount ? prev : current
      );

      // Set the winner
      auction.winner = highestBid.user;
      await auction.save();

      console.log('Winner determined:', auction.winner); // Debugging
    }

    console.log('Auction fetched (after status check):', auction); // Debugging

    res.json(auction); // Return full auction details
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new auction
exports.createAuction = async (req, res) => {
  try {
    const { title, description, startingBid, endTime } = req.body;

    // Validate required fields
    if (!title || !startingBid || !endTime) {
      return res.status(400).json({ error: 'Title, startingBid, and endTime are required' });
    }

    // Validate startingBid is a positive number
    if (isNaN(startingBid)) {
      return res.status(400).json({ error: 'Starting bid must be a number' });
    }

    // Validate endTime is a valid date in the future
    const endTimeDate = new Date(endTime);
    if (isNaN(endTimeDate.getTime())) {
      return res.status(400).json({ error: 'Invalid endTime format' });
    }
    if (endTimeDate < new Date()) {
      return res.status(400).json({ error: 'End time must be in the future' });
    }

    // Handle image upload
    let imagePath = '';
    if (req.file) {
      imagePath = req.file.path; // Save the file path
      console.log("Image uploaded:", imagePath); // Debugging: Log the image path
    } else {
      console.log("No image uploaded"); // Debugging: Log if no image is uploaded
    }

    // Create the auction
    const auction = new Auction({
      title,
      description,
      startingBid: Number(startingBid),
      currentBid: Number(startingBid), // Set currentBid to startingBid
      endTime: endTimeDate,
      owner: req.user._id, // Set owner to the authenticated user
      bids: [],
      status: 'active',
      image: imagePath, // Save the image path
    });

    await auction.save();
    console.log("Auction created:", auction); // Debugging: Log the created auction
    res.status(201).json(auction);
  } catch (err) {
    console.error("Error creating auction:", err); // Debugging: Log the error
    res.status(500).json({ error: err.message });
  }
};

// Determine the winner of an auction
exports.determineWinner = async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id)
      .populate('bids.user', 'email'); // Populate bidder details

    if (!auction) {
      return res.status(404).json({ error: 'Auction not found' });
    }

    console.log('Auction fetched (before determining winner):', auction); // Debugging

    // Check if the auction has ended
    if (auction.status !== 'ended') {
      return res.status(400).json({ error: 'Auction is still active' });
    }

    // Check if there are any bids
    if (auction.bids.length === 0) {
      return res.status(400).json({ error: 'No bids placed for this auction' });
    }

    // Find the highest bid
    const highestBid = auction.bids.reduce((prev, current) =>
      prev.amount > current.amount ? prev : current
    );

    console.log('Highest Bid:', highestBid); // Debugging

    // Set the winner
    auction.winner = highestBid.user; // Set winner to the user who placed the highest bid
    await auction.save();

    console.log('Auction after setting winner:', auction); // Debugging

    // Notify the winner
    const winner = await User.findById(highestBid.user); // Ensure User is imported
    winner.notifications.push({
      message: `You won the auction for "${auction.title}" with a bid of $${highestBid.amount}.`,
    });
    await winner.save();

    res.json({ winner: winner.email, amount: highestBid.amount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
