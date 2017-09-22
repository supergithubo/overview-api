// services/folder.service.js

module.exports = function() {
    var Folder = require('../models/folder.model').model;
    
    var module = {};
    
    module.getFolders = function(user, done) {
        Folder.find({ account: user._id, is_root: true }, function(err, folders) {
            if (err) return done(err);

            return done(null, folders);
        });
    }
    
    module.saveFolder = function(user, folder, done) {
        folder.account = user._id;
        folder.save(function(err, folder) {
            if (err) return done(err);
            
            return done(null, folder);
        });
    }
    
    module.getFolder = function(user, id, done) {
        Folder.findOne({ _id: id, account: user._id }, function(err, folder) {
            if (err) return done(err);
            if (!folder) return done(null, false);
            
            return done(null, folder);
        });
    }
    
    module.deleteFolder = function(user, id, done) {
        Folder.findOne({ _id: id, account: user._id }, function(err, folder) {
            if (err) return done(err);
            if (!folder) return done(null, false);

            Folder.remove({ _id: id }, function(err) {
                if (err) return done(err);
                
                return done(null, true);
            });
        });
    }
    
    return module;
}
