const User = require('../models/User');

exports.getNotifications = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user.notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const notification = user.notifications.id(req.params.id);
    if (!notification) return res.status(404).json({ error: 'Notification not found' });
    
    notification.read = true;
    await user.save();
    res.json(notification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
