const express = require('express')
const router = express.Router({mergeParams: true})
// mergeParams lets us use :id in parent route in app.js


const catchAsync = require('../utils/catchAsync')
const Campground = require('../models/campground')
const Review = require('../models/review')

const { validateReview, isLoggedIn, validateAuthorForReview } = require('../middleware')


// add a review
router.post('/', isLoggedIn, validateReview, catchAsync( async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    const review = new Review(req.body.review)
    review.author = req.user._id
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    req.flash('success', 'Created the new review')
    res.redirect(`/campgrounds/${req.params.id}`)
}))

// delete a review
router.delete('/:reviewId', isLoggedIn, validateAuthorForReview, async (req, res) => {
    const {id, reviewId} = req.params
    const campground = await Campground.findByIdAndUpdate(id, { $pull : { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId)
    req.flash('success', 'Deleted the review')
    res.redirect(`/campgrounds/${campground.id}`)    
})


module.exports = router