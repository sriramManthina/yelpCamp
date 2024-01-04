const express = require('express')
const router = express.Router()

const Campground = require('../models/campground')
const ExpressError = require('../utils/ExpressError')
const catchAsync = require('../utils/catchAsync')
const {campgroundJoiSchema} = require('../joiSchemas')

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
router.get('/new', (req, res) => {
    res.render('campgrounds/new')
})

// add a new campground
router.post('/', validateCampground, catchAsync( async (req, res, next) => {
    const campground = new Campground(req.body.campground)
    await campground.save()
    res.redirect(`/campgrounds/${campground.id}`)
}))

// serve page to show a single campground
router.get('/:id', catchAsync( async (req, res) => {
    const id = req.params.id
    const campground = await Campground.findById(id).populate('reviews')
    res.render('campgrounds/show', {campground})
}))

// serve page to show a edit campground page
router.get('/:id/edit', catchAsync( async (req, res) => {
    const id = req.params.id
    const campground = await Campground.findById(id)
    res.render('campgrounds/edit', {campground})
}))

// edit a campground
router.put('/:id', catchAsync( async (req, res) => {
    await Campground.findByIdAndUpdate(req.params.id, req.body.campground)
    res.redirect(`/campgrounds/${req.params.id}`)
}))

// delete a campground
router.delete('/:id', catchAsync( async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id)
    res.redirect(`/campgrounds`)
}))



module.exports = router