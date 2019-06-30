const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

router.route('/')
  // @route GET /user
  // @desc  Get all users
  .get(userController.getAllUsers);

router.route('/:userID')
  // @route GET /user/login
  // @desc  Get specific user by id
  .get(userController.getUser);

router.route('/register')
  // @route POST /user/register
  // @desc  Register new user
  .post(userController.register);

router.route('/login')
  // @route POST /user/login
  // @desc  login to account
  .post(userController.login);

router.route('/:userID/delete')
  // @route POST /user/login
  // @desc  Delete specific user
  .get(userController.deleteUser);


module.exports = router;
