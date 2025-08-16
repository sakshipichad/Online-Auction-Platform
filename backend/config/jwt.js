const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  return jwt.sign({ userId }, 'MySupersecretKey123!', { expiresIn: '30d' });
};

module.exports = generateToken;
