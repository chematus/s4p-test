const express = require('express');

const userController = require('../controllers/user.controller');

const router = express.Router();

router.route('/user/login').post(userController.loginUser);
router.route('/user/signup').post(userController.registerUser);
router.route('/user/:id([0-9]+)').get(userController.getUserProfile);
router.route('/user').get(userController.getPersonalProfile);
router.route('/user').put(userController.updatePersonalProfile);

module.exports = router;
