const express = require('express')
const router = express.Router()

const catchAsync = require('../utils/catchAsync')
const {isLoggedIn, validateCampground, validateAuthor} = require('../middleware')
const campgroundController = require('../controllers/campgrounds')

router.route('/')
    .get(catchAsync(campgroundController.index))
    .post(isLoggedIn, validateCampground, catchAsync(campgroundController.createCampground))

router.get('/new', isLoggedIn, campgroundController.renderNewForm)

router.route('/:id')
    .get(catchAsync(campgroundController.showCampground))
    .put(isLoggedIn, validateAuthor, catchAsync(campgroundController.editCampground))
    .delete(isLoggedIn, validateAuthor, catchAsync(campgroundController.deleteCampground))

router.get('/:id/edit', isLoggedIn, validateAuthor, catchAsync(campgroundController.renderEditForm))

module.exports = router