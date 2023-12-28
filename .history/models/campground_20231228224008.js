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
    // doc refers to the deleted object
    Review.deleteMany({ $in : { id: doc.reviews } })
})

module.exports = mongoose.model('Campground', CampgroundSchema)
