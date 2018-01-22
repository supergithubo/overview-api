// services/workflow.service.js

module.exports = function() {
  var Workflow = require('../models/workflow.model').model;

  var module = {};

  module.getWorkflows = function(user, done) {
    Workflow.find({ account: user._id }, function(err, workflows) {
      if (err) return done(err);

      return done(null, workflows);
    });
  };

  module.saveWorkflow = function(user, workflow, done) {
    workflow.account = user._id;
    workflow.save(function(err, workflow) {
      if (err) return done(err);

      return done(null, workflow);
    });
  };

  module.getWorkflow = function(user, id, done) {
    Workflow.findOne({ _id: id, account: user._id }, function(err, workflow) {
      if (err) return done(err);
      if (!workflow) return done(null, false);

      return done(null, workflow);
    });
  };

  module.deleteWorkflow = function(user, id, done) {
    Workflow.findOne({ _id: id, account: user._id }, function(err, workflow) {
      if (err) return done(err);
      if (!workflow) return done(null, false);

      Workflow.remove({ _id: id }, function(err) {
        if (err) return done(err);

        return done(null, true);
      });
    });
  };

  return module;
};
