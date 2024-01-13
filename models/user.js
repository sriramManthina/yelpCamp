const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')

const userSchema = new mongoose.Schema({
    email : {
        type: String,
        required: true,
        unique: true
    }
})

// adds in username, password fields and all the necessary checks like unique username
// https://www.npmjs.com/package/passport-local-mongoose
userSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('User', userSchema)