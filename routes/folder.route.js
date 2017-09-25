// routes/folder.route.js

module.exports = function(opts) {
    var express = require('express');
    var router = express.Router();
    var validateReq = require('express-validation');
    var auth = require('express-auth')(opts).authMiddleware;
    var scenario = require('../helpers/validation.js');
    
    var folderService = require('../services/folder.service')();
    var Folder = require('../models/folder.model').model;
    var builder = require('../helpers/document-builder');
    
    function getFolder(req, res, next) {
        folderService.getFolder(req.user, req.params.folder_id, function(err, folder) {
            if (err) return next(err);
            if (!folder) return res.status(404).send('Folder not found');
            
            req.folder = folder;
            return next();
        });
    }
    
    router.route('/folders')
        .get(auth.authenticate, function(req, res, next) {
            folderService.getFolders(req.user, function(err, folders) {
                if (err) return next(err);

                return res.json(folders);
            });
        })
        .post(auth.authenticate, validateReq(scenario.folder.new), function(req, res, next) {
            var folder = new Folder();
            builder.build(folder, Folder, req.body, 'is_root,created_at,updated_at');
            folderService.saveFolder(req.user, folder, function(err, folder) {
                if (err) return next(err);
                
                return res.status(201).json(folder);
            });
        });
        
    router.route('/folders/:folder_id')
        .get(auth.authenticate, getFolder, function(req, res, next) {
            return res.json(req.folder);
        })
        .put(auth.authenticate, getFolder, validateReq(scenario.folder.update), function(req, res, next) {
            builder.build(req.folder, Folder, req.body, 'is_root,created_at,updated_at');
            folderService.saveFolder(req.user, req.folder, function(err, folder) {
                if (err) return next(err);
                
                return res.json(folder);
            });
        })
        .delete(auth.authenticate, getFolder, function(req, res, next) {
            folderService.deleteFolder(req.user, req.folder._id, function(err) {
                if (err) return next(err);
                
                return res.status(204).send();
            });
        })
    return router;
}
