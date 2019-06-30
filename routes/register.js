const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');

router.route('/')
  // @route POST /register
  // @desc  Register new user
  .post(authController.register);

module.exports = router;
