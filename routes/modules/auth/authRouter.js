const express = require('express');
const router = new express.Router();
const Controller = require('./authController');
const {verifySignUp} = require('../../../middlewares');

router.post('/signin', Controller.signin);
router.post('/signup', verifySignUp.checkIfEmailIsValid, verifySignUp.checkDuplicateEmail, Controller.signup);


module.exports = router;
