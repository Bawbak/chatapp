const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Authentication controller object to export all the methodes
const authController = {};

// Register new user
authController.register = async (req, res) => {
  try {
    // Create new user by pass the info that comes from client
    const newUser = new User(req.body);
    // hash the user password
    newUser.password = await bcrypt.hash(req.body.password, 10);
    // Save new user in db
    await newUser.save();
    // Avoid to send back the password to client
    newUser.password = undefined;
    // Send the new user created to client
    res.json(newUser);

  } catch (err) {
    // res.status(400).json({ error: 'registration failed!'});
    res.status(400).json({ error: err.message});
  }
};

// login to account
authController.login = async (req, res) => {
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
authController.auth = async (req, res, next) => {
  try {
    // Check if the auth_token object exist in request header
    if(req.headers.auth_token) {
      // Token validation
      const decode = jwt.verify(req.headers.auth_token, 'SecretKey');
      // If the user still exist in DB, then the user object will be passed, else undefined will be passed
      const user = await User.findOne({ _id: decode._id }).select('-password');
      req.user = user;
    }
  } catch (err) {
    req.user = undefined;
  } finally {
    // Becuse this function is used as a middleware, it must go forward to the next pipeline anyway.
    next();
  }
};

module.exports = authController;
