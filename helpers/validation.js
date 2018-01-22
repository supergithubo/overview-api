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
      name: Joi.string(),
      description: Joi.string(),
      parent: Joi.string().regex(/^[0-9a-fA-F]{24}$/)
    }
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
    body: {
      name: Joi.string(),
      description: Joi.string()
    }
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
    body: {
      name: Joi.string(),
      type: Joi.string()
    }
  }
};

exports.priority = {
  new: {
    body: {
      name: Joi.string().required()
    }
  },
  update: {
    body: {
      name: Joi.string()
    }
  }
};
