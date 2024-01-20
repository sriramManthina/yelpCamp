const express = require('express')
const router = express.Router()

const Campground = require('../models/campground')
const catchAsync = require('../utils/catchAsync')
const {isLoggedIn, validateCampground, validateAuthor} = require('../middleware')

// serve page to show all campgrounds
router.get('/', catchAsync( async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', {campgrounds})
}))

// serve page to show a create campground page
router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new')
})

// add a new campground
router.post('/', isLoggedIn, validateCampground, catchAsync( async (req, res, next) => {
    const campground = new Campground(req.body.campground)
    campground.author = req.user.id
    await campground.save()
    req.flash('success', `Successfully made a new Campground <b> ${req.body.campground.title} </b>`)
    res.redirect(`/campgrounds/${campground.id}`)
}))

// serve page to show a single campground
router.get('/:id', catchAsync( async (req, res) => {
    const id = req.params.id
    const campground = await Campground.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author' // for populating each review's author (nested populating)
        }
    }).populate('author') // for populating campground author
    console.log('campground:', campground)
    if(!campground) {
        req.flash('error', 'Cannot find that Campground!')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', {campground})
}))

// serve page to show a edit campground page
router.get('/:id/edit', isLoggedIn, validateAuthor, catchAsync( async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    if(!campground) {
        req.flash('error', 'Cannot find that Campground!')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', {campground})
}))

// edit a campground
router.put('/:id', isLoggedIn, validateAuthor, catchAsync( async (req, res) => {
    await Campground.findByIdAndUpdate(req.params.id, req.body.campground)
    req.flash('success', `Successfully updated campground <b> ${req.body.campground.title} </b>`)
    res.redirect(`/campgrounds/${req.params.id}`)
}))

// delete a campground
router.delete('/:id', isLoggedIn, validateAuthor, catchAsync( async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id)
    req.flash('success', `Successfully deleted the campground`)
    res.redirect(`/campgrounds`)
}))



module.exports = router