const express = require('express')
const router = express.Router({mergeParams: true})
// mergeParams lets us use :id from the parent route in app.js


const catchAsync = require('../utils/catchAsync')

const { validateReview, isLoggedIn, validateAuthorForReview } = require('../middleware')
const reviewControllers = require('../controllers/reviews')

router.post('/', isLoggedIn, validateReview, catchAsync(reviewControllers.createReview))

router.delete('/:reviewId', isLoggedIn, validateAuthorForReview, catchAsync(reviewControllers.deleteReview))


module.exports = router