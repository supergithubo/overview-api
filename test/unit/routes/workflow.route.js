var dir = '../../';

var should = require('should');
var assert = require('assert');
var proxyquire = require('proxyquire');
var supertest = require('supertest');
var randexp = require('randexp');

var express = require('express');
var compression = require('compression');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var validation = require('express-validation');

var config = require(dir + '../config');
var expressAuth = require('express-auth')(config);
var Workflow = require(dir + '../models/workflow.model').model;
var type = require(dir + '../models/workflow-type.enum');
var clearDB = require('mocha-mongoose')(config.db.uri, {
  noClear: true
});

describe('unit/routes/workflow.route', function() {

  var request;
  var workflowServiceStub;
  var workflow;

  before(function(done) {
    workflow = {
      _id: new randexp(/^[0-9a-f]{24}$/).gen(),
      name: 'workflow name',
      type: type.enum.DEFERRED.key
    };

    workflowServiceStub = {};
    var expressAuthStub = {
      authMiddleware: {
        authenticate: function(req, res, next) {
          return next();
        }
      }
    };

    var app = express();
    validation.options({
      status: 422,
      statusText: 'Unprocessable Entity'
    });

    app.use(compression());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
      extended: false
    }));

    var workflowRouter = proxyquire(dir + '../routes/workflow.route', {
      '../services/workflow.service': function() {
        return workflowServiceStub;
      },
      'express-auth': function(opts) {
        return expressAuthStub;
      }
    })(config);

    app.use('/v1', [
      workflowRouter
    ]);
    app.use(function(err, req, res, next) {
      if(err.name == 'ValidationError' || err.message == 'validation error') {
        return res.status(422).json(err);
      }

      return res.status(500).json(err);
    });

    request = supertest(app);

    done();
  });

  describe('GET v1/workflows', function() {
    it('should return 500', function(done) {
      workflowServiceStub.getWorkflows = function(user, done) {
        return done({ message: 'Mongoose error' });
      };

      request.get('/v1/workflows')
        .end(function(err, res) {
          if (err) throw err;
          res.status.should.be.equal(500);
          done();
        });
    });
    it('should return 200', function(done) {
      workflowServiceStub.getWorkflows = function(user, done) {
        return done(null, []);
      };

      request.get('/v1/workflows')
        .end(function(err, res) {
          if (err) throw err;
          res.status.should.be.equal(200);
          done();
        });
    });
  });

  describe('POST v1/workflows', function() {
    it('should return 500', function(done) {
      workflowServiceStub.saveWorkflow = function(user, workflow, done) {
        return done({ message: 'Mongoose error' });
      };

      request.post('/v1/workflows')
        .send(workflow)
        .end(function(err, res) {
          if (err) throw err;
          res.status.should.be.equal(500);
          done();
        });
    });
    it('should return 422', function(done) {
      var body = {};

      workflowServiceStub.saveWorkflow = function(user, workflow, done) {
        throw new Error('Should have not been called');
      };

      request.post('/v1/workflows')
        .send(body)
        .end(function(err, res) {
          if (err) throw err;
          res.status.should.be.equal(422);
          res.body.errors[0].field[0].should.be.equal('name');
          res.body.errors[0].types[0].should.be.equal('any.required');
          res.body.errors[1].field[0].should.be.equal('type');
          res.body.errors[1].types[0].should.be.equal('any.required');
          done();
        });
    });
    it('should return 201', function(done) {
      workflowServiceStub.saveWorkflow = function(user, workflow, done) {
        return done(null, {});
      };

      request.post('/v1/workflows')
        .send(workflow)
        .end(function(err, res) {
          if (err) throw err;
          res.status.should.be.equal(201);
          done();
        });
    });
  });

  describe('GET v1/workflows/:workflow', function() {
    it('should return 500', function(done) {
      workflowServiceStub.getWorkflow = function(user, id, done) {
        return done({ message: 'Mongoose error' });
      };

      request.get('/v1/workflows/' + workflow._id)
        .end(function(err, res) {
          if (err) throw err;
          res.status.should.be.equal(500);
          done();
        });
    });
    it('should return 404', function(done) {
      workflowServiceStub.getWorkflow = function(user, id, done) {
        return done(null, false);
      };

      request.get('/v1/workflows/' + workflow._id)
        .end(function(err, res) {
          if (err) throw err;
          res.status.should.be.equal(404);
          done();
        });
    });
    it('should return 200', function(done) {
      workflowServiceStub.getWorkflow = function(user, id, done) {
        return done(null, {});
      };

      request.get('/v1/workflows/' + workflow._id)
        .end(function(err, res) {
          if (err) throw err;
          res.status.should.be.equal(200);
          done();
        });
    });
  });

  describe('PUT v1/workflows/:workflow', function() {
    it('should return 500', function(done) {
      workflowServiceStub.getWorkflow = function(user, id, done) {
        return done({ message: 'Mongoose error' });
      };
      workflowServiceStub.saveWorkflow = function(user, workflow, done) {
        throw new Error('Should have not been called');
      };

      request.put('/v1/workflows/' + workflow._id)
        .send(workflow)
        .end(function(err, res) {
          if (err) throw err;
          res.status.should.be.equal(500);
          done();
        });
    });
    it('should return 404', function(done) {
      workflowServiceStub.getWorkflow = function(user, id, done) {
        return done(null, false);
      };
      workflowServiceStub.saveWorkflow = function(user, workflow, done) {
        throw new Error('Should have not been called');
      };

      request.put('/v1/workflows/' + workflow._id)
        .send(workflow)
        .end(function(err, res) {
          if (err) throw err;
          res.status.should.be.equal(404);
          done();
        });
    });

    it('should return 500', function(done) {
      workflowServiceStub.getWorkflow = function(user, id, done) {
        return done(null, {});
      };
      workflowServiceStub.saveWorkflow = function(user, workflow, done) {
        return done({ message: 'Mongoose error' });
      };

      request.put('/v1/workflows/' + workflow._id)
        .send(workflow)
        .end(function(err, res) {
          if (err) throw err;
          res.status.should.be.equal(500);
          done();
        });
    });
    it.skip('should return 422', function(done) {
      var data = {};
      workflowServiceStub.getWorkflow = function(user, id, done) {
        return done(null, {});
      };
      workflowServiceStub.saveWorkflow = function(user, workflow, done) {
        throw new Error('Should have not been called');
      };

      request.put('/v1/workflows/' + workflow._id)
        .send(data)
        .end(function(err, res) {
          if (err) throw err;
          res.status.should.be.equal(422);
          done();
        });
    });
    it('should return 200', function(done) {
      workflowServiceStub.getWorkflow = function(user, id, done) {
        return done(null, {});
      };
      workflowServiceStub.saveWorkflow = function(user, workflow, done) {
        return done(null, {});
      };

      request.put('/v1/workflows/' + workflow._id)
        .send(workflow)
        .end(function(err, res) {
          if (err) throw err;
          res.status.should.be.equal(200);
          done();
        });
    });
  });

  describe('DELETE v1/workflows/:workflow', function() {
    it('should return 500', function(done) {
      workflowServiceStub.getWorkflow = function(user, id, done) {
        return done({ message: 'Mongoose error' });
      };
      workflowServiceStub.deleteWorkflow = function(user, id, done) {
        throw new Error('Should have not been called');
      };

      request.delete('/v1/workflows/' + workflow._id)
        .end(function(err, res) {
          if (err) throw err;
          res.status.should.be.equal(500);
          done();
        });
    });
    it('should return 404', function(done) {
      workflowServiceStub.getWorkflow = function(user, id, done) {
        return done(null, false);
      };
      workflowServiceStub.deleteWorkflow = function(user, id, done) {
        throw new Error('Should have not been called');
      };

      request.delete('/v1/workflows/' + workflow._id)
        .end(function(err, res) {
          if (err) throw err;
          res.status.should.be.equal(404);
          done();
        });
    });

    it('should return 500', function(done) {
      workflowServiceStub.getWorkflow = function(user, id, done) {
        return done(null, {});
      };
      workflowServiceStub.deleteWorkflow = function(user, id, done) {
        return done({ message: 'Mongoose error' });
      };

      request.delete('/v1/workflows/' + workflow._id)
        .end(function(err, res) {
          if (err) throw err;
          res.status.should.be.equal(500);
          done();
        });
    });
    it('should return 204', function(done) {
      workflowServiceStub.getWorkflow = function(user, id, done) {
        return done(null, {});
      };
      workflowServiceStub.deleteWorkflow = function(user, id, done) {
        return done();
      };

      request.delete('/v1/workflows/' + workflow._id)
        .end(function(err, res) {
          if (err) throw err;
          res.status.should.be.equal(204);
          done();
        });
    });
  });

  after(function(done) {
    done();
  });
});
