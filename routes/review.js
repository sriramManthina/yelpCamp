const express = require('express')
const router = express.Router({mergeParams: true})
// mergeParams lets us use :id in parent route in app.js


const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')
const {reviewJoiSchema} = require('../joiSchemas')

const Campground = require('../models/campground')
const Review = require('../models/review')


const validateReview = (req, res, next) => {
    const {error} = reviewJoiSchema.validate(req.body)

    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}


// add a review
router.post('/', validateReview, catchAsync( async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    const review = new Review(req.body.review)
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    req.flash('success', 'Created the new review')
    res.redirect(`/campgrounds/${req.params.id}`)
}))

// delete a review
router.delete('/:reviewId', async (req, res) => {
    const {id, reviewId} = req.params
    const campground = await Campground.findByIdAndUpdate(id, { $pull : { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId)
    req.flash('success', 'Deleted the review')
    res.redirect(`/campgrounds/${campground.id}`)    
})


module.exports = router