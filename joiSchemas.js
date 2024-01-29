const BaseJoi = require('joi')
const sanitizeHTML = require('sanitize-html')

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: { // property
            validate(value, helpers) {
                const clean = sanitizeHTML(value, { // from sanitize-html pkg
                    allowedTags: [], // HTML tags
                    allowedAttributes: {}, // HTML attributes
                })

                // If value changed, then error is given
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                
                // otherwise sanitized HTML value is returned
                return clean
            }
        }
    }
})

const Joi = BaseJoi.extend(extension)

module.exports.campgroundJoiSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required().escapeHTML(),
        price: Joi.number().required().min(0),
        description: Joi.string().required().escapeHTML(),
        // image: Joi.string().required(),
        location: Joi.string().required().escapeHTML()
    }).required(),
    deleteImages: Joi.array()
})

module.exports.reviewJoiSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required().escapeHTML()
    }).required()
})

// Did not add JoiSchema for user, because passport takes care of it automatically