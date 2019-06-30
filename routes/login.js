const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');

router.route('/')
  // @route POST /login
  // @desc  login to account
  .post(authController.login);

module.exports = router;
