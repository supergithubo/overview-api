var dir = '../../';

var should = require('should');
var proxyquire = require('proxyquire');
var randexp = require('randexp');
var mongoose = require('mongoose');
var async = require('async');

var User = require('express-auth')().user.model;
var Folder = require(dir + '../models/folder.model').model;

var folderStatus = require(dir + '../models/folder-status.enum');
var userRoles = require('express-auth')().roles;
var config = require(dir + '../config');
var clearDB = require('mocha-mongoose')(config.db.uri, {
  noClear: true
});

describe('unit/models/folder.model', function() {

  var account, parentFolder;

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
        parentFolder = new Folder({ account: account._id, name: 'name', description: 'description' });
        parentFolder.save(function(err, r) {
          if(err) throw err;
          parentFolder = r;
          callback();
        });
      }
    ], function(err) {
      if(err) throw err;

      done();
    });
  });

  describe('model save', function() {
    it('should satisfy folder with account, name & description', function(done) {
      var folder = new Folder({ account: account._id, name: 'name', description: 'description' });
      folder.project = {
        start_date: Date.now(),
        end_date: Date.now(),
        status: folderStatus.enum.PENDING.key
      };

      folder.save(function(err, f) {
        if(err) throw err;
        f.account.should.be.equal(folder.account);
        f.name.should.be.equal(folder.name);
        f.description.should.be.equal(folder.description);
        f.is_root.should.be.equal(true);
        f.is_project.should.be.equal(false);
        f.project.toString().should.be.equal('undefined');
        should.exist(folder.__v);
        should.exist(folder._id);
        should.exist(folder.updated_at);
        should.exist(folder.created_at);
        done();
      });
    });
    it('should satisfy folder with project', function(done) {
      var folder = new Folder({ account: account._id, name: 'name', description: 'description', is_project: true });
      folder.project = {
        start_date: Date.now(),
        end_date: Date.now(),
        status: folderStatus.enum.PENDING.key
      };

      folder.save(function(err, f) {
        if(err) throw err;
        f.account.should.be.equal(folder.account);
        f.name.should.be.equal(folder.name);
        f.description.should.be.equal(folder.description);
        f.is_root.should.be.equal(true);
        f.is_project.should.be.equal(true);
        should.exist(folder.__v);
        should.exist(folder._id);
        should.exist(folder.updated_at);
        should.exist(folder.created_at);
        should.exist(folder.project.start_date);
        should.exist(folder.project.status);
        done();
      });
    });
    it('should set folder root to false when parent is set', function(done) {
      var folder = new Folder({ account: account._id, name: 'name', description: 'description', parent: parentFolder._id });
      folder.save(function(err, f) {
        if(err) throw err;
        f.parent.should.be.equal(folder.parent);
        f.is_root.should.be.equal(false);
        done();
      });
    });
    it('should validate required project when is_project is true', function(done) {
      var folder = new Folder({ account: account._id, name: 'name', description: 'description', is_project: true });
      folder.save(function(err, f) {
        err.errors['project.start_date'].kind.should.be.equal('required');
        err.errors['project.status'].kind.should.be.equal('required');
        Object.keys(err.errors).length.should.be.equal(2);
        done();
      });
    });
    it('should validate required properties', function(done) {
      var folder = new Folder();
      folder.save(function(err, f) {
        err.errors['account'].kind.should.be.equal('required');
        err.errors['name'].kind.should.be.equal('required');
        err.errors['description'].kind.should.be.equal('required');
        Object.keys(err.errors).length.should.be.equal(3);
        done();
      });
    });
    it('should validate invalid references', function(done) {
      var folder = new Folder({ account: 'id', name: 'name', description: 'description', parent: 'id' });
      folder.save(function(err, f) {
        err.errors['account'].kind.should.be.equal('ObjectID');
        err.errors['parent'].kind.should.be.equal('ObjectID');
        Object.keys(err.errors).length.should.be.equal(2);
        done();
      });
    });
  });

  describe('model update', function() {
    it('should update updated_at and not created_at upon folder update', function(done) {
      var folder = new Folder({ account: account._id, name: 'name', description: 'description', is_project: true });
      folder.project = {
        start_date: Date.now(),
        end_date: Date.now(),
        status: folderStatus.enum.PENDING.key
      };

      folder.save(function(err, f) {
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
