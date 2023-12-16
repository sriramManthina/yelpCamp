const express = require('express')
const mongoose = require('mongoose')

const path = require('path')

const Campground = require('./models/campground')

const app = express();
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'))

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


// add a new campground
app.post('/campgrounds', async (req, res) => {
    res.send(req.body)
})

app.listen(3000, () => {
    console.log('Server Up')
})

