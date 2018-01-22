var dir = '../../';

var should = require('should');
var mongoose = require('mongoose');
var async = require('async');

var User = require('express-auth')().user.model;
var Task = require(dir + '../models/task.model').model;
var Folder = require(dir + '../models/folder.model').model;
var Priority = require(dir + '../models/priority.model').model;
var Workflow = require(dir + '../models/workflow.model').model;

var workflowType = require(dir + '../models/workflow-type.enum');
var config = require(dir + '../config');

var clearDB = require('mocha-mongoose')(config.db.uri, {
  noClear: true
});

describe('unit/models/task.model', function() {

  var account, folder, priority, workflow;

  before(function(done) {
    mongoose.Promise = global.Promise;
    mongoose.connect(config.db.uri, { useMongoClient: true });

    clearDB(done);
  });

  before(function(done) {
    async.series([
      function(callback) {
        account = new User({ username: 'john', email: 'john@gmail.com', password: 'overview' });
        account.save(function(err, r) {
          if(err) throw err;
          account = r;
          callback();
        });
      },
      function(callback) {
        async.parallel([
          function(callback) {
            folder = new Folder({ account: account._id, name: 'name', description: 'description' });
            folder.save(function(err, r) {
              if(err) throw err;
              folder = r;
              callback();
            });
          },
          function(callback) {
            priority = new Priority({ account: account._id, name: 'name'});
            priority.save(function(err, r) {
              if(err) throw err;
              priority = r;
              callback();
            });
          },
          function(callback) {
            workflow = new Workflow({ account: account._id, name: 'name', type: workflowType.enum.DEFERRED.key});
            workflow.save(function(err, r) {
              if(err) throw err;
              workflow = r;
              callback();
            });
          }
        ], function(err) {
          if(err) callback(err);

          callback(null);
        });
      }
    ], function(err) {
      if(err) throw err;

      done();
    });
  });

  describe('model save', function() {
    it('should satisfy task with folder, name & description', function(done) {
      var task = new Task({ folder: folder._id, name: 'name', description: 'desc', priority: priority._id, status: workflow._id});
      task.save(function(err, f) {
        if(err) throw err;
        f.folder.should.be.equal(task.folder);
        f.name.should.be.equal(task.name);
        f.description.should.be.equal(task.description);
        f.priority.should.be.equal(task.priority);
        f.status.should.be.equal(task.status);
        should.exist(task.__v);
        should.exist(task._id);
        should.exist(task.color);
        should.exist(task.updated_at);
        should.exist(task.created_at);
        done();
      });
    });
    it('should validate required properties', function(done) {
      var task = new Task();
      task.save(function(err, f) {
        err.errors['folder'].kind.should.be.equal('required');
        err.errors['name'].kind.should.be.equal('required');
        err.errors['description'].kind.should.be.equal('required');
        err.errors['priority'].kind.should.be.equal('required');
        err.errors['status'].kind.should.be.equal('required');
        Object.keys(err.errors).length.should.be.equal(5);
        done();
      });
    });
    it('should validate invalid references', function(done) {
      var task = new Task({ folder: 'id', name: 'name', description: 'desc', priority: 'id', status: 'id'});
      task.save(function(err, f) {
        err.errors['folder'].kind.should.be.equal('ObjectID');
        err.errors['priority'].kind.should.be.equal('ObjectID');
        err.errors['status'].kind.should.be.equal('ObjectID');
        Object.keys(err.errors).length.should.be.equal(3);
        done();
      });
    });
  });

  describe('model update', function() {
    it('should update updated_at and not created_at upon task update', function(done) {
      var task = new Task({ folder: folder._id, name: 'name', description: 'desc', priority: priority._id, status: workflow._id});

      task.save(function(err, f) {
        if(err) throw err;

        should.exist(f.created_at);
        should.exist(f.updated_at);

        var created_at = f.created_at;
        var updated_at = f.updated_at;

        setTimeout(function(){
          f.save(function(err, ff) {
            if(err) throw err;

            ff.created_at.should.be.equal(created_at);
            ff.updated_at.should.not.be.equal(updated_at);
            done();
          });
        }, 1);
      });
    });
  });

  after(function(done) {
    mongoose.connection.close();
    done();
  });
});
