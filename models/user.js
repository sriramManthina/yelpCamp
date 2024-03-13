const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')

const userSchema = new mongoose.Schema({
    email : {
        type: String,
        required: true,
        unique: true,
        match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
    },
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 6,
        maxlength: 8,
        match: /^[a-zA-Z][a-zA-Z0-9_]{5,7}$/
      }
    // passportJS stores hash password, it doesn't store normal password
    //   password: {
    //     type: String,
    //     // required: true,
    //     minlength: 8,
    //     match: /^(?=.*\d)(?=.*[A-Z]).{6,}$/
    //   }
})

// adds in username, password fields and all the necessary checks like unique username
// https://www.npmjs.com/package/passport-local-mongoose
userSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('User', userSchema)