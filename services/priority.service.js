// services/priority.service.js

module.exports = function() {
  var Priority = require('../models/priority.model').model;

  var module = {};

  module.getPriorities = function(user, done) {
    Priority.find({ account: user._id }, function(err, priorities) {
      if (err) return done(err);

      return done(null, priorities);
    });
  };

  module.savePriority = function(user, priority, done) {
    priority.account = user._id;
    priority.save(function(err, priority) {
      if (err) return done(err);

      return done(null, priority);
    });
  };

  module.getPriority = function(user, id, done) {
    Priority.findOne({ _id: id, account: user._id }, function(err, priority) {
      if (err) return done(err);
      if (!priority) return done(null, false);

      return done(null, priority);
    });
  };

  module.deletePriority = function(user, id, done) {
    Priority.findOne({ _id: id, account: user._id }, function(err, priority) {
      if (err) return done(err);
      if (!priority) return done(null, false);

      Priority.remove({ _id: id }, function(err) {
        if (err) return done(err);

        return done(null, true);
      });
    });
  };

  return module;
};
