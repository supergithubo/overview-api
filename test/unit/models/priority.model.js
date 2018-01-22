var dir = '../../';

var should = require('should');
var proxyquire = require('proxyquire');
var randexp = require('randexp');
var mongoose = require('mongoose');
var async = require('async');

var User = require('express-auth')().user.model;
var Priority = require(dir + '../models/priority.model').model;

var userRoles = require('express-auth')().roles;
var config = require(dir + '../config');
var clearDB = require('mocha-mongoose')(config.db.uri, {
  noClear: true
});

describe('unit/models/priority.model', function() {

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
    it('should satisfy priority with account, name & type', function(done) {
      var priority = new Priority({ account: account._id, name: 'name' });
      priority.save(function(err, f) {
        if(err) throw err;
        f.account.should.be.equal(priority.account);
        f.name.should.be.equal(priority.name);
        should.exist(priority.__v);
        should.exist(priority._id);
        should.exist(priority.updated_at);
        should.exist(priority.created_at);
        done();
      });
    });
    it('should validate required properties', function(done) {
      var priority = new Priority();
      priority.save(function(err, f) {
        err.errors['account'].kind.should.be.equal('required');
        err.errors['name'].kind.should.be.equal('required');
        Object.keys(err.errors).length.should.be.equal(2);
        done();
      });
    });
    it('should validate invalid references', function(done) {
      var priority = new Priority({ account: 'id', name: 'name' });
      priority.save(function(err, f) {
        err.errors['account'].kind.should.be.equal('ObjectID');
        Object.keys(err.errors).length.should.be.equal(1);
        done();
      });
    });
  });

  describe('model update', function() {
    it('should update updated_at and not created_at upon priority update', function(done) {
      var priority = new Priority({ account: account._id, name: 'name' });
      priority.save(function(err, f) {
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
