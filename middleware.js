const { campgroundJoiSchema, reviewJoiSchema } = require('./joiSchemas')
const Campground = require('./models/campground')
const Review = require('./models/review')
const ExpressError = require('./utils/ExpressError')

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl // for redirecting to the same url after login
        req.flash('error', 'You must be signed in first')
        return res.redirect('/login')
    }
    next()
}

// storeReturnTo is a middleware that needs to be executed before passport.authenticate
// it is for storing where the user was before getting redirected to login
// check 530. IMPORTANT: Passport.js Updates — Fixing The returnTo/Redirect Issue for more info

// for redirecting to the same url after login
module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports.validateCampground = (req, res, next) => {
    const {error} = campgroundJoiSchema.validate(req.body)

    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

module.exports.validateReview = (req, res, next) => {
    const {error} = reviewJoiSchema.validate(req.body)

    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

// middleware, checks if the logged in user is the author of the campground
// must be placed after the middleware isLoggedIn, because req.user is required for this middleware
module.exports.validateAuthor = async (req, res, next) => { 
    const { id } = req.params
    const campground = await Campground.findById(id)
    if (!campground.author._id.equals(req.user._id)) { // the user is not the author
        req.flash('error', `You don't have the permission for this`)
        return res.redirect(`/campgrounds/${campground._id}`)
    }
    next()
}

// middleware, checks if the logged in user is the author of the review
// must be placed after the middleware isLoggedIn, because req.user is required for this middleware
module.exports.validateAuthorForReview = async (req, res, next) => { 
    const { id, reviewId } = req.params
    const review = await Review.findById(reviewId)
    if (!review.author._id.equals(req.user._id)) { // the user is not the author of the review
        req.flash('error', `You don't have the permission for this`)
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}


// middleware, checks if the user credentials match the requirement
module.exports.validateRegisterForm = async (req, res, next) => { 
    const { username, email, password } = req.body
    const isUserNameValid = /^[a-zA-Z][a-zA-Z0-9_]{5,7}$/.test(username)
    const isEmailValid = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email)
    const isPasswordValid = /^(?=.*\d)(?=.*[A-Z]).{6,}$/.test(password)
    const pattern = /^[a-zA-Z]/

    if(!isUserNameValid) {
        if (username.length < 6 || username.length > 8){
            req.flash('error', `Username must be 6-8 characters`)
            return res.redirect('/register')
        }
        else if (!pattern.test(username[0])){
            req.flash('error', `Username must start with an alphabet`)
            return res.redirect('/register')
        }
        else{
            req.flash('error', 'Username can only contain alphabets, digits, and _')
            return res.redirect('/register')
        }
    }
    if(!isEmailValid) {
        req.flash('error', `Invalid Email Address, Please check again`)
        return res.redirect('/register')
    }
    if(!isPasswordValid) {
        if (password.length < 6){
            req.flash('error', `Password must contain at least 6 characters`)
            return res.redirect('/register')
        }
        else{
            req.flash('error', 'Password must contain at least 1 number and Upper-case letter')
            return res.redirect('/register')
        }
    }
    next()
}