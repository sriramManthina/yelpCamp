const express = require('express')
const router = express.Router()

const Campground = require('../models/campground')
const ExpressError = require('../utils/ExpressError')
const catchAsync = require('../utils/catchAsync')
const {campgroundJoiSchema} = require('../joiSchemas')
const {isLoggedIn} = require('../middleware')


const validateCampground = (req, res, next) => {
    const {error} = campgroundJoiSchema.validate(req.body)

    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

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
    await campground.save()
    req.flash('success', `Successfully made a new Campground <b> ${req.body.campground.title} </b>`)
    res.redirect(`/campgrounds/${campground.id}`)
}))

// serve page to show a single campground
router.get('/:id', catchAsync( async (req, res) => {
    const id = req.params.id
    const campground = await Campground.findById(id).populate('reviews')
    if(!campground) {
        req.flash('error', 'Cannot find that Campground!')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', {campground})
}))

// serve page to show a edit campground page
router.get('/:id/edit', isLoggedIn, catchAsync( async (req, res) => {
    const id = req.params.id
    const campground = await Campground.findById(id)
    if(!campground) {
        req.flash('error', 'Cannot find that Campground!')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', {campground})
}))

// edit a campground
router.put('/:id', isLoggedIn, catchAsync( async (req, res) => {
    await Campground.findByIdAndUpdate(req.params.id, req.body.campground)
    req.flash('success', `Successfully updated campground <b> ${req.body.campground.title} </b>`)
    res.redirect(`/campgrounds/${req.params.id}`)
}))

// delete a campground
router.delete('/:id', isLoggedIn, catchAsync( async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id)
    req.flash('success', `Successfully deleted the campground`)
    res.redirect(`/campgrounds`)
}))



module.exports = router