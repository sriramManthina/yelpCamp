const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Review = require('./review')
const { cloudinary } = require('../cloudinary')

// creating a separate schema for images, since we are adding a virtual property called thumbnail for each image
const ImageSchema = new Schema({
    url: String,
    fileName: String  
})

ImageSchema.virtual('thumbnail').get(function() {
    // this refers to an individual image doc
    return this.url.replace('/upload', '/upload/w_200')
})

const CampgroundSchema = new Schema({
    title: String,
    price: Number,
    images: [ImageSchema],
    description: String,
    location: String,
    geometry: {
        type: {
            type: String,
            required: true,
            enum: ['Point']
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }]
})

CampgroundSchema.post('findOneAndDelete', async function (doc){
    // doc refers to the deleted campground object
    if (doc){
        // delete all reviews associated with the campground
        await Review.deleteMany({ _id : { $in: doc.reviews } })

        // delete images
        for (let img of doc.images) {
            await cloudinary.uploader.destroy(img.fileName);
        }
    }
})


module.exports = mongoose.model('Campground', CampgroundSchema)
