const express = require('express')
const router = express.Router()
const passport = require('passport')

const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')
const { storeReturnTo, validateRegisterForm } = require('../middleware')
const userController = require('../controllers/users')

router.route('/register')
    .get(userController.renderRegisterForm)
    .post(validateRegisterForm, catchAsync(userController.registerUser))

router.route('/login')
    .get(userController.renderLoginForm)
    .post(storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), userController.loginUser)
// using passport.authenticate middleware for authentication
// it calls req.login() within its functionality, so authenticating also does logging in directly 
// which uses local strategy
// failureFlash enables to send flash messages on failure
// failureRedirect enables to redirect to /login on failure 

router.get('/logout', userController.logoutUser)

module.exports = router

