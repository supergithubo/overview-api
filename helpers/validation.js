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
    body: {}
  }
};

exports.task = {
  new: {
    body: {
      name: Joi.string().required(),
      description: Joi.string().required()
    }
  },
  update: {
    body: {}
  }
};

exports.workflow = {
  new: {
    body: {
      name: Joi.string().required(),
      type: Joi.string().required()
    }
  },
  update: {
    body: {}
  }
};

exports.priority = {
  new: {
    body: {
      name: Joi.string().required()
    }
  },
  update: {
    body: {}
  }
};
