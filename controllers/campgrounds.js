const Campground = require('../models/campground')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const mapBoxToken = process.env.MAPBOX_KEY
const geoCoder = mbxGeocoding({accessToken : mapBoxToken})
const { cloudinary } = require('../cloudinary')
const sanitizeHTML = require('sanitize-html')

// serve page to show all campgrounds
module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', {campgrounds})
}

// serve page to show a create campground page
module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new')
}

// add a new campground
module.exports.createCampground = async (req, res) => {
    const geoData = await geoCoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    console.log(geoData.body.features[0].geometry)
    const campground = new Campground(req.body.campground)
    campground.geometry = geoData.body.features[0].geometry
    campground.author = req.user.id
    campground.images = req.files.map(f => ({url: f.path, fileName: f.filename}))
    await campground.save()
    // console.log(campground)
    req.flash('success', `Successfully made a new Campground ` + sanitizeHTML(`<b> ${req.body.campground.title} </b>`))
    res.redirect(`/campgrounds/${campground.id}`)
}

// serve page to show a single campground
module.exports.showCampground = async (req, res) => {
    const id = req.params.id
        const campground = await Campground.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author' // for populating each review's author (nested populating)
        }
    }).populate('author') // for populating campground author
    if(!campground) {
        req.flash('error', 'Cannot find that Campground!')
        return res.redirect('/campgrounds')
    }
        res.render('campgrounds/show', {campground})
}

// serve page to show a edit campground page
module.exports.renderEditForm = async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    if(!campground) {
        req.flash('error', 'Cannot find that Campground!')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', {campground})
}

// edit a campground
module.exports.editCampground = async (req, res) => {
    console.log(req.body)
    const campground = await Campground.findByIdAndUpdate(req.params.id, req.body.campground)
    const newImages = req.files.map(f => ({url: f.path, fileName: f.filename}))
    campground.images.push(...newImages)
    await campground.save()
    // remove images which need to be deleted from DB and cloudinary
    // pull images with fileName present in deleteImages Array
    if (req.body.deleteImages){
        for(let imageFileName of req.body.deleteImages) {
            console.log(imageFileName)
            await cloudinary.uploader.destroy(imageFileName)
        }
        await campground.updateOne({$pull: { images: { fileName: {$in: req.body.deleteImages} } }})
        console.log(campground)
    }
    req.flash('success', `Successfully updated campground ` + sanitizeHTML(`<b> ${req.body.campground.title} </b>`))
    res.redirect(`/campgrounds/${req.params.id}`)
}

// delete a campground
module.exports.deleteCampground = async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id)
    req.flash('success', `Successfully deleted the campground`)
    res.redirect(`/campgrounds`)
}