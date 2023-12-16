const express = require('express')
const methodOverride = require('method-override')
const mongoose = require('mongoose')

const path = require('path')

const Campground = require('./models/campground')

const app = express();
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'))

app.use(express.urlencoded({extended:true})) // for parsing data from req.body
app.use(methodOverride('_method')) // for sending put/patch requests from forms

mongoose.connect('mongodb://localhost:27017/yelp-camp')
.then(() => {
    console.log('Connected to Mongoose')
})
.catch((e) => {
    console.log(`Error in connecting to Mongoose: ${e}`)
})
    
// serve page to show all campgrounds
app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', {campgrounds})
})

// serve page to show a create campground page
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new')
})

// serve page to show a single campground
app.get('/campgrounds/:id', async (req, res) => {
    const id = req.params.id
    const campground = await Campground.findById(id)
    res.render('campgrounds/show', {campground})
})

// serve page to show a edit campground page
app.get('/campgrounds/:id/edit', async (req, res) => {
    const id = req.params.id
    const campground = await Campground.findById(id)
    res.render('campgrounds/edit', {campground})
})

// add a new campground
app.post('/campgrounds', async (req, res) => {
    const campground = new Campground(req.body.campground)
    await campground.save()

    res.redirect(`/campgrounds/${campground.id}`)
})

// edit a campground
app.put('/campgrounds/:id', async (req, res) => {
    await Campground.findByIdAndUpdate(req.params.id, req.body.campground)
    res.redirect(`/campgrounds/${req.params.id}`)
})

// delete a campground
app.delete('/campgrounds/:id', async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id)
    res.redirect(`/campgrounds`)
})


app.listen(3000, () => {
    console.log('Server Up')
})

