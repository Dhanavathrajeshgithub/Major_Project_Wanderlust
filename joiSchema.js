const Joi = require('joi');
module.exports.listingSchema = Joi.object({
    list: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().required().min(0),
        location: Joi.string().required(),
        country: Joi.string().required(),
        image: Joi.string().allow("",null),
        category: Joi.alternatives().try(
            Joi.array().items(Joi.string()), // Array of strings
            Joi.string(),                   // String
            Joi.valid(null)                 // Null
        )
    }).required()
});
module.exports.reviewSchema =  Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(0).max(5),
        comment: Joi.string().required()
    }).required()

});
