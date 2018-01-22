// services/task.service.js

module.exports = function() {
  var Task = require('../models/task.model').model;

  var module = {};

  module.getTasks = function(folder, done) {
    Task.find({ folder: folder._id }, function(err, tasks) {
      if (err) return done(err);

      return done(null, tasks);
    });
  };

  module.saveTask = function(folder, task, done) {
    task.folder = folder._id;
    task.save(function(err, task) {
      if (err) return done(err);

      return done(null, task);
    });
  };

  module.getTask = function(folder, id, done) {
    Task.findOne({ _id: id, folder: folder._id }, function(err, task) {
      if (err) return done(err);
      if (!task) return done(null, false);

      return done(null, task);
    });
  };

  module.deleteTask = function(folder, id, done) {
    Task.findOne({ _id: id, folder: folder._id }, function(err, task) {
      if (err) return done(err);
      if (!task) return done(null, false);

      Task.remove({ _id: id }, function(err) {
        if (err) return done(err);

        return done(null, true);
      });
    });
  };

  return module;
};
