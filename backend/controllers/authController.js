const Auction = require('../models/Auction');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const generateToken = require('../config/jwt');

exports.signup = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    
    if (existingUser) return res.status(400).json({ error: 'Email already exists' });

    const user = new User({ email, password });
    await user.save();
    res.status(201).json({ token: generateToken(user._id) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Add bcrypt comparison
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user._id);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

