module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl // for redirecting to the same url after login
        req.flash('error', 'You must be signed in first')
        return res.redirect('/login')
    }
    next()
}

// for redirecting to the same url after login
module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}