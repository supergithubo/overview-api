var dir = "../../";

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
var Priority = require(dir + '../models/priority.model').model;
var clearDB = require('mocha-mongoose')(config.db.uri, {
    noClear: true
});

describe('unit/routes/priority.route', function() {
    
    var request;
    var priorityServiceStub;
    var priority;
    
    before(function(done) {
        priority = {
            _id: new randexp(/^[0-9a-f]{24}$/).gen(),
            name: "priority name"
        };
        
        priorityServiceStub = {};
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
        
        var priorityRouter = proxyquire(dir + '../routes/priority.route', {
            '../services/priority.service': function() {
                return priorityServiceStub;
            },
            'express-auth': function(opts) {
                return expressAuthStub;
            }
        })(config);

        app.use('/v1', [
            priorityRouter
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
    
    describe('GET v1/priorities', function() {
        it('should return 500', function(done) {
            priorityServiceStub.getPriorities = function(user, done) {
                return done({ message: 'Mongoose error' });
            };
            
            request.get('/v1/priorities')
                .end(function(err, res) {
                    if (err) throw err;
                    res.status.should.be.equal(500);
                    done();
                });
        });
        it('should return 200', function(done) {
            priorityServiceStub.getPriorities = function(user, done) {
                return done(null, []);
            };
            
            request.get('/v1/priorities')
                .end(function(err, res) {
                    if (err) throw err;
                    res.status.should.be.equal(200);
                    done();
                });
        });
    });
    
    describe('POST v1/priorities', function() {
        it('should return 500', function(done) {
            priorityServiceStub.savePriority = function(user, priority, done) {
                return done({ message: 'Mongoose error' });
            };
            
            request.post('/v1/priorities')
                .send(priority)
                .end(function(err, res) {
                    if (err) throw err;
                    res.status.should.be.equal(500);
                    done();
                });
        });
        it('should return 422', function(done) {
            var body = {};

            priorityServiceStub.savePriority = function(user, priority, done) {
                throw new Error("Should have not been called");
            };
            
            request.post('/v1/priorities')
                .send(body)
                .end(function(err, res) {
                    if (err) throw err;
                    res.status.should.be.equal(422);
                    res.body.errors[0].field[0].should.be.equal('name');
                    res.body.errors[0].types[0].should.be.equal('any.required');
                    done();
                });
        });
        it('should return 201', function(done) {
            priorityServiceStub.savePriority = function(user, priority, done) {
                return done(null, {});
            };
            
            request.post('/v1/priorities')
                .send(priority)
                .end(function(err, res) {
                    if (err) throw err;
                    res.status.should.be.equal(201);
                    done();
                });
        });
    });
    
    describe('GET v1/priorities/:priority', function() {
        it('should return 500', function(done) {
            priorityServiceStub.getPriority = function(user, id, done) {
                return done({ message: 'Mongoose error' });
            };
            
            request.get('/v1/priorities/' + priority._id)
                .end(function(err, res) {
                    if (err) throw err;
                    res.status.should.be.equal(500);
                    done();
                });
        });
        it('should return 404', function(done) {
            priorityServiceStub.getPriority = function(user, id, done) {
                return done(null, false);
            };
            
            request.get('/v1/priorities/' + priority._id)
                .end(function(err, res) {
                    if (err) throw err;
                    res.status.should.be.equal(404);
                    done();
                });
        });
        it('should return 200', function(done) {
            priorityServiceStub.getPriority = function(user, id, done) {
                return done(null, {});
            };
            
            request.get('/v1/priorities/' + priority._id)
                .end(function(err, res) {
                    if (err) throw err;
                    res.status.should.be.equal(200);
                    done();
                });
        });
    });
    
    describe('PUT v1/priorities/:priority', function() {
        it('should return 500', function(done) {
            priorityServiceStub.getPriority = function(user, id, done) {
                return done({ message: 'Mongoose error' });
            };
            priorityServiceStub.savePriority = function(user, priority, done) {
                throw new Error("Should have not been called");
            };
            
            request.put('/v1/priorities/' + priority._id)
                .send(priority)
                .end(function(err, res) {
                    if (err) throw err;
                    res.status.should.be.equal(500);
                    done();
                });
        });
        it('should return 404', function(done) {
            priorityServiceStub.getPriority = function(user, id, done) {
                return done(null, false);
            };
            priorityServiceStub.savePriority = function(user, priority, done) {
                throw new Error("Should have not been called");
            };
            
            request.put('/v1/priorities/' + priority._id)
                .send(priority)
                .end(function(err, res) {
                    if (err) throw err;
                    res.status.should.be.equal(404);
                    done();
                });
        });
        
        it('should return 500', function(done) {
            priorityServiceStub.getPriority = function(user, id, done) {
                return done(null, {});
            };
            priorityServiceStub.savePriority = function(user, priority, done) {
                return done({ message: 'Mongoose error' });
            };
            
            request.put('/v1/priorities/' + priority._id)
                .send(priority)
                .end(function(err, res) {
                    if (err) throw err;
                    res.status.should.be.equal(500);
                    done();
                });
        });
        it.skip('should return 422', function(done) {
            var data = {};
            priorityServiceStub.getPriority = function(user, id, done) {
                return done(null, {});
            };
            priorityServiceStub.savePriority = function(user, priority, done) {
                throw new Error("Should have not been called");
            };
            
            request.put('/v1/priorities/' + priority._id)
                .send(data)
                .end(function(err, res) {
                    if (err) throw err;
                    res.status.should.be.equal(422);
                    done();
                });
        });
        it('should return 200', function(done) {
            priorityServiceStub.getPriority = function(user, id, done) {
                return done(null, {});
            };
            priorityServiceStub.savePriority = function(user, priority, done) {
                return done(null, {});
            };
            
            request.put('/v1/priorities/' + priority._id)
                .send(priority)
                .end(function(err, res) {
                    if (err) throw err;
                    res.status.should.be.equal(200);
                    done();
                });
        });
    });
    
    describe('DELETE v1/priorities/:priority', function() {
        it('should return 500', function(done) {
            priorityServiceStub.getPriority = function(user, id, done) {
                return done({ message: 'Mongoose error' });
            };
            priorityServiceStub.deletePriority = function(user, id, done) {
                throw new Error("Should have not been called");
            };
            
            request.delete('/v1/priorities/' + priority._id)
                .end(function(err, res) {
                    if (err) throw err;
                    res.status.should.be.equal(500);
                    done();
                });
        });
        it('should return 404', function(done) {
            priorityServiceStub.getPriority = function(user, id, done) {
                return done(null, false);
            };
            priorityServiceStub.deletePriority = function(user, id, done) {
                throw new Error("Should have not been called");
            };
            
            request.delete('/v1/priorities/' + priority._id)
                .end(function(err, res) {
                    if (err) throw err;
                    res.status.should.be.equal(404);
                    done();
                });
        });
        
        it('should return 500', function(done) {
            priorityServiceStub.getPriority = function(user, id, done) {
                return done(null, {});
            };
            priorityServiceStub.deletePriority = function(user, id, done) {
                return done({ message: 'Mongoose error' });
            };
            
            request.delete('/v1/priorities/' + priority._id)
                .end(function(err, res) {
                    if (err) throw err;
                    res.status.should.be.equal(500);
                    done();
                });
        });
        it('should return 204', function(done) {
            priorityServiceStub.getPriority = function(user, id, done) {
                return done(null, {});
            };
            priorityServiceStub.deletePriority = function(user, id, done) {
                return done();
            };
            
            request.delete('/v1/priorities/' + priority._id)
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