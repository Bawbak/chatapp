const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

router.route('/')
  // @route GET /user
  // @desc  Get all users
  .get(userController.getAllUsers);

router.route('/:userID')
  // @route GET /user/:userID
  // @desc  Get specific user by id
  .get(userController.getUser);

router.route('/:userID/delete')
  // @route GET /user/:userID/delete
  // @desc  Delete specific user
  .get(userController.deleteUser);


module.exports = router;
