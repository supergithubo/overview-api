// routes/task.route.js

module.exports = function(opts) {
  var express = require('express');
  var router = express.Router();
  var validateReq = require('express-validation');
  var auth = require('express-auth')(opts).authMiddleware;
  var scenario = require('../helpers/validation.js');

  var folderService = require('../services/folder.service')();
  var taskService = require('../services/task.service')();
  var Task = require('../models/task.model').model;
  var builder = require('../helpers/document-builder');

  function getFolder(req, res, next) {
    folderService.getFolder(req.user, req.params.folder_id, function(err, folder) {
      if (err) return next(err);
      if (!folder) return res.status(404).send('Folder not found');

      req.folder = folder;
      return next();
    });
  }

  function getTask(req, res, next) {
    taskService.getTask(req.folder, req.params.task_id, function(err, task) {
      if (err) return next(err);
      if (!task) return res.status(404).send('Task not found');

      req.task = task;
      return next();
    });
  }

  router.route('/folders/:folder_id/tasks')
    .get(auth.authenticate, getFolder, function(req, res, next) {
      taskService.getTasks(req.folder, function(err, tasks) {
        if (err) return next(err);

        return res.json(tasks);
      });
    })
    .post(auth.authenticate, getFolder, validateReq(scenario.task.new), function(req, res, next) {
      var task = new Task();
      builder.build(task, Task, req.body, 'created_at,updated_at');
      taskService.saveTask(req.folder, task, function(err, task) {
        if (err) return next(err);

        return res.status(201).json(task);
      });
    });

  router.route('/folders/:folder_id/tasks/:task_id')
    .get(auth.authenticate, getFolder, getTask, function(req, res, next) {
      return res.json(req.task);
    })
    .put(auth.authenticate, getFolder, getTask, validateReq(scenario.task.update), function(req, res, next) {
      builder.build(req.task, Task, req.body, 'created_at,updated_at');
      taskService.saveTask(req.folder, req.task, function(err, task) {
        if (err) return next(err);

        return res.json(task);
      });
    })
    .delete(auth.authenticate, getFolder, getTask, function(req, res, next) {
      taskService.deleteTask(req.folder, req.task._id, function(err) {
        if (err) return next(err);

        return res.status(204).send();
      });
    });
  return router;
};
