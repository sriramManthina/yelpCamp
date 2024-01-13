const express = require('express')
const router = express.Router()
const passport = require('passport')

const User = require('../models/user')
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')
const { storeReturnTo } = require('../middleware')


router.get('/register', (req, res) => {
    res.render('users/register')
})

router.post('/register', catchAsync( async (req, res, next) => {
    try {
        const { email, username, password } = req.body
        const user = new User({ email, username })
        const registeredUser = await User.register(user, password)
        // console.log(registeredUser)

        // this login method enables the user to login directly after signing up
        req.login(registeredUser, (err) => {
            if (err) return next(err)

            req.flash('success', 'Welcome to Yelp Camp!')
            res.redirect('/campgrounds')
        })
    } catch (e) {
        req.flash('error', `Error: ${e.message}`)
        res.redirect('/register')
    }
}))

router.get('/login', (req, res) => {
    res.render('users/login')
})

// storeReturnTo is a middleware that needs to be executed before passport.authenticate
// it is for storing where the user was before getting redirected to login
// check 530. IMPORTANT: Passport.js Updates — Fixing The returnTo/Redirect Issue for more info

// using passport.authenticate middleware for authentication
// it calls req.login() within its functionality, so authenticating also does logging in directly 
// which uses local strategy
// failureFlash enables to send flash messages on failure
// failureRedirect enables to redirect to /login on failure 
router.post('/login', storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'Welcome Back!')
    const redirectUrl = res.locals.returnTo || '/campgrounds'
    res.redirect(redirectUrl)
})


router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err)
        }
        req.flash('success', 'Successfully Logged out')
        res.redirect('/campgrounds')
    });
})

module.exports = router

