
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authenticate = require('../middleware/auth');


// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch {
    res.status(500).json({ error: 'Could not fetch users' });
  }
});
router.post('/resolve', authenticate, async (req, res) => {
  const { emails } = req.body;
  try {
    const users = await User.find({ email: { $in: emails } }, '_id');
    res.json(users.map(u => u._id));
  } catch {
    res.status(500).json({ error: "Failed to resolve users" });
  }
});

module.exports = router;
