// routes/priority.route.js

module.exports = function(opts) {
    var express = require('express');
    var router = express.Router();
    var validateReq = require('express-validation');
    var auth = require('express-auth')(opts).authMiddleware;
    var scenario = require('../helpers/validation.js');
    
    var priorityService = require('../services/priority.service')();
    var Priority = require('../models/priority.model').model;
    var builder = require('../helpers/document-builder');
    
    function getPriority(req, res, next) {
        priorityService.getPriority(req.user, req.params.priority_id, function(err, priority) {
            if (err) return next(err);
            if (!priority) return res.status(404).send('Priority not found');
            
            req.priority = priority;
            return next();
        });
    }
    
    router.route('/priorities')
        .get(auth.authenticate, function(req, res, next) {
            priorityService.getPriorities(req.user, function(err, priorities) {
                if (err) return next(err);

                return res.json(priorities);
            });
        })
        .post(auth.authenticate, validateReq(scenario.priority.new), function(req, res, next) {
            var priority = new Priority();
            builder.build(priority, Priority, req.body, 'created_at,updated_at');
            priorityService.savePriority(req.user, priority, function(err, priority) {
                if (err) return next(err);
                
                return res.status(201).json(priority);
            });
        });
        
    router.route('/priorities/:priority_id')
        .get(auth.authenticate, getPriority, function(req, res, next) {
            return res.json(req.priority);
        })
        .put(auth.authenticate, getPriority, validateReq(scenario.priority.update), function(req, res, next) {
            builder.build(req.priority, Priority, req.body, 'created_at,updated_at');
            priorityService.savePriority(req.user, req.priority, function(err, priority) {
                if (err) return next(err);
                
                return res.json(priority);
            });
        })
        .delete(auth.authenticate, getPriority, function(req, res, next) {
            priorityService.deletePriority(req.user, req.priority._id, function(err) {
                if (err) return next(err);
                
                return res.status(204).send();
            });
        })
    return router;
}
