const ejsMate = require('ejs-mate')
const express = require('express')
const methodOverride = require('method-override')
const mongoose = require('mongoose')


const path = require('path')

const Campground = require('./models/campground')
const Review = require('./models/review')

const catchAsync = require('./utils/catchAsync')
const ExpressError = require('./utils/ExpressError')
const {campgroundJoiSchema} = require('./joiSchemas')

const app = express();

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'))

app.use(express.urlencoded({extended:true})) // for parsing data from req.body
app.use(methodOverride('_method')) // for sending put/patch requests from forms

const validateCampground = (req, res, next) => {
    const {error} = campgroundJoiSchema.validate(req.body)

    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}


mongoose.connect('mongodb://localhost:27017/yelp-camp')
.then(() => {
    console.log('Connected to Mongoose')
})
.catch((e) => {
    console.log(`Error in connecting to Mongoose: ${e}`)
})
    
// serve default home page
app.get('/', catchAsync( async (req, res) => {
    res.render('home.ejs')
}))

// serve page to show all campgrounds
app.get('/campgrounds', catchAsync( async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', {campgrounds})
}))

// serve page to show a create campground page
app.get('/campgrounds/new', catchAsync( (req, res) => {
    res.render('campgrounds/new')
}))

// add a new campground
app.post('/campgrounds', catchAsync( async (req, res, next) => {
    const campground = new Campground(req.body.campground)
    await campground.save()
    res.redirect(`/campgrounds/${campground.id}`)
}))


// serve page to show a single campground
app.get('/campgrounds/:id', catchAsync( async (req, res) => {
    const id = req.params.id
    const campground = await Campground.findById(id)
    res.render('campgrounds/show', {campground})
}))

app.post('/campgrounds/:id/reviews', catchAsync( async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    const review = new Review(req.body.review)
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    res.redirect(`/campgrounds/${req.params.id}`)
}))

// serve page to show a edit campground page
app.get('/campgrounds/:id/edit', catchAsync( async (req, res) => {
    const id = req.params.id
    const campground = await Campground.findById(id)
    res.render('campgrounds/edit', {campground})
}))



// edit a campground
app.put('/campgrounds/:id', catchAsync( async (req, res) => {
    await Campground.findByIdAndUpdate(req.params.id, req.body.campground)
    res.redirect(`/campgrounds/${req.params.id}`)
}))

// delete a campground
app.delete('/campgrounds/:id', catchAsync( async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id)
    res.redirect(`/campgrounds`)
}))


app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

// error handling
app.use((err, req, res, next) => {
    const {statusCode = 500} = err
    if (!err.message) err.message = 'Something Went Wrong!'
    res.status(statusCode).render('error', {err})  
})


app.listen(3000, () => {
    console.log('Server Up')
})

