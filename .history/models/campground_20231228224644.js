const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Review = require('./review')

const CampgroundSchema = new Schema({
    title: String,
    price: Number,
    image: String,
    description: String,
    location: String,
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }]
})

CampgroundSchema.post('findOneAndDelete', async function(doc){
    // doc refers to the deleted campground object
    if (doc){
        // delete all reviews associated with the campground
        Review.deleteMany({ id : { $in: doc.reviews } })
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema)
