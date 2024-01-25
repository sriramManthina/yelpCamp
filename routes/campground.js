const express = require('express')
const router = express.Router()
const multer = require('multer')
const {storage} = require('../cloudinary')
const upload = multer({ 
    storage,
    limits: {
        files: 3, // Set the maximum number of files
        fileSize: 1024 * 1024, // Set the maximum file size (optional)
    },
})

const catchAsync = require('../utils/catchAsync')
const {isLoggedIn, validateCampground, validateAuthor} = require('../middleware')
const campgroundController = require('../controllers/campgrounds')

router.route('/')
    .get(catchAsync(campgroundController.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgroundController.createCampground))

router.get('/new', isLoggedIn, campgroundController.renderNewForm)

router.route('/:id')
    .get(catchAsync(campgroundController.showCampground))
    .put(isLoggedIn, validateAuthor, upload.array('image'), catchAsync(campgroundController.editCampground))
    .delete(isLoggedIn, validateAuthor, catchAsync(campgroundController.deleteCampground))

router.get('/:id/edit', isLoggedIn, validateAuthor, catchAsync(campgroundController.renderEditForm))

module.exports = router