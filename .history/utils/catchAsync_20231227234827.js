module.exports = func => {
    return (req, res, next) => {
        func(req, res, next).catch(next)
    }
}

// a function (say func) will be passed as parameter to catchAsync
// if the func has no errors, it runs smoothly
// if there is an error, catch will call next() method ie, error handler method

// this is just an alternative to write try catches in the routes