// controllers/authController.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.register = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = new User({ email, password });
    await user.save();
    
    // ✅ Fixed: changed userId → id
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    
    res.json({ token, message: 'User registered successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    // ✅ Fixed: changed userId → id
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    
    res.json({ token, message: 'Login successful' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
