const User = require('../models/user');

// User controller object to export all the methodes
let userController = {};

// Send all users
userController.getAllUsers = async (req, res) => {
  try {
    // Fetch all the user data except password field
    const users = await User.find().select('-password');
    // Send them as json
    res.json(users);

  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

// Send specific user
userController.getUser = async (req, res) => {
  try {
    // Fetch the specific user by ID, except the password field
    const user = await User.findOne({ _id: req.params.userID }).select('-password');
    // Check if the user doen't exist
    if(!user) {
      res.json({ error: "there isn't any user with this ID!"});
      return;
    }
    // Send it back if it exists
    res.json(user);

  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

// Delete specific user
userController.deleteUser = async (req, res) => {
  try {
    // Only an authorized user can be deleted
    if(req.user && req.user._id == req.params.userID) {
      const userID = req.user._id;
      await User.deleteOne({ _id: userID });
      res.json({ status: 'OK'});
    }
  } catch (err) {
    // res.status(500).send({ error: err.message });
    res.status(500).send({ error: 'error' });
  }
};

module.exports = userController;
