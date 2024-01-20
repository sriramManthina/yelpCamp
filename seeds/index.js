const mongoose = require('mongoose')

const Campground = require('../models/campground')
const Review = require('../models/review')
const User = require('../models/user')
const cities = require('./cities')
const {places, descriptors} = require('./seedHelpers')

mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
    console.log('database connected')
})

const getRandomElement = (arr) => arr[Math.floor( Math.random() * arr.length )]

const sampleDescription = `Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic quas aperiam, amet quidem, dicta quis nisi exercitationem voluptatum cumque aut debitis iste illum temporibus nostrum repellendus placeat eligendi ducimus veritatis! Officiis sunt dolorum architecto neque. Eius, placeat aperiam. Optio magnam doloremque, quis rem ipsum est qui voluptatum, voluptate nam dolor nobis officia assumenda deleniti non neque inventore cum modi ratione. Nostrum corporis necessitatibus placeat rem iure eaque! Accusamus vitae assumenda, consequuntur, officiis aut animi ducimus autem corporis quasi accusantium molestiae magni fugit fugiat ut dolore cumque doloremque sunt, quis soluta! A voluptate repellendus expedita pariatur porro eius, illum soluta. Commodi, voluptatibus ipsam placeat doloribus doloremque sed unde numquam odio accusamus eum fuga dolor minima eligendi! Fugit explicabo repellendus alias dicta?`

seedDB = async () => {
    await Campground.deleteMany()
    await Review.deleteMany()
    await User.deleteMany()
    for(let i=0; i<50; i++){
        let random1000 = Math.floor(Math.random()*1000)
        let randomPrice = Math.floor(Math.random()*30) + 20
        const camp = new Campground({
            location: `${cities[random1000].city} - ${cities[random1000].state}`,
            title: `${getRandomElement(descriptors)} ${getRandomElement(places)}`,
            price: randomPrice,
            image: 'https://source.unsplash.com/collection/483251',
            description: sampleDescription,
            author: '659fb07cb96ec11024fe82ce'
        })
        await camp.save()
    }
}

seedDB().then(() => {
    mongoose.connection.close()
})