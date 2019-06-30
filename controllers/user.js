const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
    // Fetch the specific user by its ID
    const user = await User.findOne({ _id: req.params.userID });
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

// Register new user
userController.register = async (req, res) => {
  try {
    // Create new user by pass the info that comes from client
    const newUser = new User(req.body);
    // hash the user password
    newUser.password = bcrypt.hashSync(req.body.password, 10);
    // Save new user in db
    await newUser.save();
    // Avoid to send back the password to client
    newUser.password = undefined;
    // Send the new user created to client
    res.json(newUser);

  } catch (err) {
    res.status(400).json({ error: 'registration failed!'});
  }
};

// login to account
userController.login = async (req, res) => {
  try {
    // Find the only one user whit that email. because email must be unique
    const user = await User.findOne({ email: req.body.email });
    // Check if the user is exist
    if(!user) {
      res.status(401).json({ error: "The username and/or password is incorrect!"});
      return;
    }
    // Check if the password is correct
    if(!bcrypt.compareSync(req.body.password, user.password)) {
      res.status(401).json({ error: "The username and/or password is incorrect!"});
      return;
    }
    // If everything is fine, then send back a token which created by jwt, that user could use that to authorization to move between pages
    res.json({'auth_token': jwt.sign({ email: user.email, name: user.name, _id: user.id}, 'SecretKey')});

  } catch (err) {
    res.status(401).json({ error: 'login failed!'});
  }
};

// Check Authentication
userController.auth = async (req, res, next) => {
  try {
    // Check if the auth_token object exist in request header
    if(req.headers.auth_token) {
      // Token validation
      let user = await jwt.verify(req.headers.auth_token, 'SecretKey');
      // If the user still exist in DB, then the user object will be passed, else undefined will be passed
      user = await User.findOne({ _id: user._id }).select('-password');
      req.user = user;
    }
  } catch (err) {
    req.user = undefined;
  } finally {
    // Becuse this function is used as a middleware, it must go to the next pipeline anyway.
    next();
  }
};

module.exports = userController;
