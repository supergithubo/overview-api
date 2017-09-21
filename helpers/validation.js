// helpers/validation.js

var Joi = require('joi');

exports.folder = {
    new: {
        body: {
            name: Joi.string().required(),
            description: Joi.string().required(),
            parent: Joi.string().regex(/^[0-9a-fA-F]{24}$/)
        }
    },
    update: {
        body: {
            parent: Joi.string().regex(/^[0-9a-fA-F]{24}$/)
        }
    }
};