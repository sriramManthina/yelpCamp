if (process.env.NODE_ENV !== "production"){ // In developer environment
    require('dotenv').config()
}

const ejsMate = require('ejs-mate')
const express = require('express')
const methodOverride = require('method-override')
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet')

const path = require('path')

const User = require('./models/user')
const campgroundRouter = require('./routes/campground')
const reviewRouter = require('./routes/review')
const userRouter = require('./routes/user')
const catchAsync = require('./utils/catchAsync')
const ExpressError = require('./utils/ExpressError')

mongoose.connect('mongodb://localhost:27017/yelp-camp')
.then(() => {
    console.log('Connected to Mongoose')
})
.catch((e) => {
    console.log(`Error in connecting to Mongoose: ${e}`)
})

const app = express();

// for serving ejs templates (server side templates)
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'))

app.use(express.json());
app.use(express.urlencoded({extended:true})) // for parsing data from req.body
app.use(mongoSanitize()) // for preventing Mongo Injection Attacks
app.use(methodOverride('_method')) // for sending put/patch requests from forms
app.use(express.static(path.join(__dirname, '/public'))) // for serving static files in public directory

// for adding sessions
const sessionConfig = {
    name: 'sessionCookie',
    secret: 'someRandomSecretKey',
    resave: false, // to remove warning
    saveUninitialized: true, // to remove warning
    cookie: {
        httpOnly: true, // by default its true, prevents XSS attacks
        // safe: true, // for httpsOnly [not in localhost, only use in prod] 
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
// for flash messages (it also needs sessions support)
app.use(flash())

app.use(helmet())
const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
    "https://code.jquery.com"
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dfildjiol/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);


// for passport configuration (passport is used for authentication)
// passport requires sessions support
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser()) // sets, how to store user in session
passport.deserializeUser(User.deserializeUser()) // sets, how to delete user from a session

// middlewares
app.use((req, res, next) => {
    // res.locals variables can be accessed by all the templates
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    res.locals.currentUser = req.user
    next()
})

// routers
app.use('/', userRouter)
app.use('/campgrounds', campgroundRouter)
app.use('/campgrounds/:id/reviews', reviewRouter)

    
// serve default home page
app.get('/', catchAsync( async (req, res) => {
    res.render('home')
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

