require('dotenv').config();
const path = require('path');

const express = require('express');


const cors = require('cors');

const connectDB = require('./config/db');

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/comments', require('./routes/commentRoutes'));

app.use('/api/auctions', require('./routes/auctionRoutes'));
app.use('/api/bids', require('./routes/bidRoutes'));
app.use('/api/watchlist', require('./routes/watchlistRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/profile', require('./routes/profileRoutes'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));







