const Review = require('../models/review')
const Campground = require('../models/campground')

// add a review
module.exports.createReview = async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    const review = new Review(req.body.review)
    review.author = req.user._id
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    req.flash('success', 'Created the new review')
    res.redirect(`/campgrounds/${req.params.id}`)
}

// delete a review
module.exports.deleteReview = async (req, res) => {
    const {id, reviewId} = req.params
    const campground = await Campground.findByIdAndUpdate(id, { $pull : { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId)
    req.flash('success', 'Deleted the review')
    res.redirect(`/campgrounds/${campground.id}`)    
}