var dir = '../../';

var should = require('should');
var proxyquire = require('proxyquire');
var randexp = require('randexp');
var mongoose = require('mongoose');
var async = require('async');

var User = require('express-auth')().user.model;
var Workflow = require(dir + '../models/workflow.model').model;

var userRoles = require('express-auth')().roles;
var workflowType = require(dir + '../models/workflow-type.enum');
var config = require(dir + '../config');
var clearDB = require('mocha-mongoose')(config.db.uri, {
  noClear: true
});

describe('unit/models/workflow.model', function() {

  var account;

  before(function(done) {
    mongoose.Promise = global.Promise;
    mongoose.connect(config.db.uri, { useMongoClient: true });

    clearDB(done);
  });

  before(function(done) {
    account = new User({ username: 'john', email: 'john@gmail.com', password: 'overview' });
    account.save(function(err, r) {
      if(err) throw err;
      account = r;
      done();
    });
  });

  describe('model save', function() {
    it('should satisfy workflow with account, name & type', function(done) {
      var workflow = new Workflow({ account: account._id, name: 'name', type: workflowType.enum.DEFERRED.key });
      workflow.save(function(err, f) {
        if(err) throw err;
        f.account.should.be.equal(workflow.account);
        f.name.should.be.equal(workflow.name);
        f.type.should.be.equal(workflow.type);
        should.exist(workflow.__v);
        should.exist(workflow._id);
        should.exist(workflow.updated_at);
        should.exist(workflow.created_at);
        done();
      });
    });
    it('should validate required properties', function(done) {
      var workflow = new Workflow();
      workflow.save(function(err, f) {
        err.errors['account'].kind.should.be.equal('required');
        err.errors['name'].kind.should.be.equal('required');
        err.errors['type'].kind.should.be.equal('required');
        Object.keys(err.errors).length.should.be.equal(3);
        done();
      });
    });
    it('should validate invalid references', function(done) {
      var workflow = new Workflow({ account: 'id', name: 'name', type: workflowType.enum.DEFERRED.key });
      workflow.save(function(err, f) {
        err.errors['account'].kind.should.be.equal('ObjectID');
        Object.keys(err.errors).length.should.be.equal(1);
        done();
      });
    });
  });

  describe('model update', function() {
    it('should update updated_at and not created_at upon workflow update', function(done) {
      var workflow = new Workflow({ account: account._id, name: 'name', type: workflowType.enum.DEFERRED.key });
      workflow.save(function(err, f) {
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
