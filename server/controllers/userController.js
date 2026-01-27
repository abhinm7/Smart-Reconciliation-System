const User = require('../models/User');
const bcrypt = require('bcryptjs');

const getUsers = async (req, res) => {
  const users = await User.find({}).select('-password').sort({ createdAt: -1 });
  res.json(users);
};

const registerUser = async (req, res) => {
  const { username, email, password, role } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const user = await User.create({
    username,
    email,
    password, 
    role: role || 'viewer'
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};


const deleteUser = async (req, res) => {
  
  const user = await User.findById(req.params.id);

  if (user) {
    await user.deleteOne();
    res.json({ message: 'User removed' });

  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

module.exports = { getUsers, registerUser, deleteUser };