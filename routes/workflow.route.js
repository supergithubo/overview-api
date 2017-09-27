// routes/workflow.route.js

module.exports = function(opts) {
    var express = require('express');
    var router = express.Router();
    var validateReq = require('express-validation');
    var auth = require('express-auth')(opts).authMiddleware;
    var scenario = require('../helpers/validation.js');
    
    var workflowService = require('../services/workflow.service')();
    var Workflow = require('../models/workflow.model').model;
    var builder = require('../helpers/document-builder');
    
    function getWorkflow(req, res, next) {
        workflowService.getWorkflow(req.user, req.params.workflow_id, function(err, workflow) {
            if (err) return next(err);
            if (!workflow) return res.status(404).send('Workflow not found');
            
            req.workflow = workflow;
            return next();
        });
    }
    
    router.route('/workflows')
        .get(auth.authenticate, function(req, res, next) {
            workflowService.getWorkflows(req.user, function(err, workflows) {
                if (err) return next(err);

                return res.json(workflows);
            });
        })
        .post(auth.authenticate, validateReq(scenario.workflow.new), function(req, res, next) {
            var workflow = new Workflow();
            builder.build(workflow, Workflow, req.body, 'created_at,updated_at');
            workflowService.saveWorkflow(req.user, workflow, function(err, workflow) {
                if (err) return next(err);
                
                return res.status(201).json(workflow);
            });
        });
        
    router.route('/workflows/:workflow_id')
        .get(auth.authenticate, getWorkflow, function(req, res, next) {
            return res.json(req.workflow);
        })
        .put(auth.authenticate, getWorkflow, validateReq(scenario.workflow.update), function(req, res, next) {
            builder.build(req.workflow, Workflow, req.body, 'created_at,updated_at');
            workflowService.saveWorkflow(req.user, req.workflow, function(err, workflow) {
                if (err) return next(err);
                
                return res.json(workflow);
            });
        })
        .delete(auth.authenticate, getWorkflow, function(req, res, next) {
            workflowService.deleteWorkflow(req.user, req.workflow._id, function(err) {
                if (err) return next(err);
                
                return res.status(204).send();
            });
        })
    return router;
}
