// services/folder.service.js

module.exports = function() {
  var Folder = require('../models/folder.model').model;

  var module = {};

  module.getFolders = function(user, done) {
    Folder.aggregate([
      { $match: { account: user._id, is_root: true } },
      { $lookup: { from: 'folders', localField: '_id', foreignField: 'parent', as: 'children' } },
      { $unwind: { path: '$children', preserveNullAndEmptyArrays: true } },
      { $lookup: { from: 'folders', localField: 'children._id', foreignField: 'parent', as: 'children.children' } },
      { $project: { name: 1, color: 1, 'children._id': 1, 'children.name': 1, 'children.color': 1, 'children.children': 1 } },
      { $group : { _id : '$_id', name: { $first: '$name' }, color: { $first: '$color'}, children: { $push: '$children'} } },
    ], function(err, folders) {
      if (err) return done(err);

      for(var i = 0; i < folders.length; i++) {
        var folder = folders[i];
        for(var j = 0; j < folder.children.length; j++) {
          var child = folder.children[j];
          if(typeof child._id == 'undefined') {
            folders[i].children = [];
          }
        }
      }

      return done(null, folders);
    });
  };

  module.saveFolder = function(user, folder, done) {
    folder.account = user._id;
    folder.save(function(err, folder) {
      if (err) return done(err);

      return done(null, folder);
    });
  };

  module.getFolder = function(user, id, done) {
    Folder.findOne({ _id: id, account: user._id }, function(err, folder) {
      if (err) return done(err);
      if (!folder) return done(null, false);

      return done(null, folder);
    });
  };

  module.deleteFolder = function(user, id, done) {
    Folder.findOne({ _id: id, account: user._id }, function(err, folder) {
      if (err) return done(err);
      if (!folder) return done(null, false);

      Folder.remove({ _id: id }, function(err) {
        if (err) return done(err);

        return done(null, true);
      });
    });
  };

  return module;
};
