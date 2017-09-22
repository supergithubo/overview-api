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
var Folder = require(dir + '../models/folder.model').model;
var clearDB = require('mocha-mongoose')(config.db.uri, {
    noClear: true
});

describe('unit/routes/folder.route', function() {
    
    var request;
    var folderServiceStub;
    
    before(function(done) {
        folderServiceStub = {};
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
        
        var folderRouter = proxyquire(dir + '../routes/folder.route', {
            '../services/folder.service': function() {
                return folderServiceStub;
            },
            'express-auth': function(opts) {
                return expressAuthStub;
            }
        })(config);

        app.use('/v1', [
            folderRouter
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
    
    describe('GET v1/folders', function() {
        it('should return 500', function(done) {
            folderServiceStub.getFolders = function(user, done) {
                return done({ message: 'Mongoose error' });
            };
            
            request.get('/v1/folders')
                .end(function(err, res) {
                    if (err) throw err;
                    res.status.should.be.equal(500);
                    done();
                });
        });
        it('should return 200', function(done) {
            folderServiceStub.getFolders = function(user, done) {
                return done(null, []);
            };
            
            request.get('/v1/folders')
                .end(function(err, res) {
                    if (err) throw err;
                    res.status.should.be.equal(200);
                    done();
                });
        });
    });
    
    describe('POST v1/folders', function() {
        it('should return 500', function(done) {
            folderServiceStub.saveFolder = function(user, folder, done) {
                return done({ message: 'Mongoose error' });
            };
            var data = {
                parent: new randexp(/^[0-9a-f]{24}$/).gen(),
                name: "folder name",
                description: "folder description"
            };
            request.post('/v1/folders')
                .send(data)
                .end(function(err, res) {
                    if (err) throw err;
                    res.status.should.be.equal(500);
                    done();
                });
        });
        it('should return 422', function(done) {
            var data = {
                parent: 'invalid id'
            };
            request.post('/v1/folders')
                .send(data)
                .end(function(err, res) {
                    if (err) throw err;
                    res.status.should.be.equal(422);
                    res.body.errors[0].field[0].should.be.equal('name');
                    res.body.errors[0].types[0].should.be.equal('any.required');
                    res.body.errors[1].field[0].should.be.equal('description');
                    res.body.errors[1].types[0].should.be.equal('any.required');
                    res.body.errors[2].field[0].should.be.equal('parent');
                    res.body.errors[2].types[0].should.be.equal('string.regex.base');
                    done();
                });
        });
        it('should return 201', function(done) {
            folderServiceStub.saveFolder = function(user, folder, done) {
                return done(null, {});
            };
            var data = {
                parent: new randexp(/^[0-9a-f]{24}$/).gen(),
                name: "folder name",
                description: "folder description"
            };
            request.post('/v1/folders')
                .send(data)
                .end(function(err, res) {
                    if (err) throw err;
                    res.status.should.be.equal(201);
                    done();
                });
        });
    });
    
    describe('GET v1/folders/:folder', function() {
        it('should return 500', function(done) {
            folderServiceStub.getFolder = function(user, id, done) {
                return done({ message: 'Mongoose error' });
            };
            
            request.get('/v1/folders/id')
                .end(function(err, res) {
                    if (err) throw err;
                    res.status.should.be.equal(500);
                    done();
                });
        });
        it('should return 200', function(done) {
            folderServiceStub.getFolder = function(user, id, done) {
                return done(null, {});
            };
            
            request.get('/v1/folders/id')
                .end(function(err, res) {
                    if (err) throw err;
                    res.status.should.be.equal(200);
                    done();
                });
        });
    });
    
    describe('PUT v1/folders/:folder', function() {
        it('should return 500', function(done) {
            folderServiceStub.getFolder = function(user, id, done) {
                return done({ message: 'Mongoose error' });
            };
            var data = {
                parent: new randexp(/^[0-9a-f]{24}$/).gen(),
                name: "folder name",
                description: "folder description"
            };
            request.put('/v1/folders/id')
                .send(data)
                .end(function(err, res) {
                    if (err) throw err;
                    res.status.should.be.equal(500);
                    done();
                });
        });
        it('should return 500', function(done) {
            folderServiceStub.getFolder = function(user, id, done) {
                return done(null, {});
            };
            folderServiceStub.saveFolder = function(user, folder, done) {
                return done({ message: 'Mongoose error' });
            };
            var data = {
                parent: new randexp(/^[0-9a-f]{24}$/).gen(),
                name: "folder name",
                description: "folder description"
            };
            request.put('/v1/folders/id')
                .send(data)
                .end(function(err, res) {
                    if (err) throw err;
                    res.status.should.be.equal(500);
                    done();
                });
        });
        it('should return 422', function(done) {
            var data = {
                parent: 'invalid id',
                name: "folder name",
                description: "folder description"
            };
            request.put('/v1/folders/id')
                .send(data)
                .end(function(err, res) {
                    if (err) throw err;
                    res.status.should.be.equal(422);
                    res.body.errors[0].field[0].should.be.equal('parent');
                    res.body.errors[0].types[0].should.be.equal('string.regex.base');
                    done();
                });
        });
        it('should return 200', function(done) {
            folderServiceStub.getFolder = function(user, id, done) {
                return done(null, {});
            };
            folderServiceStub.saveFolder = function(user, folder, done) {
                return done(null, {});
            };
            var data = {
                parent: new randexp(/^[0-9a-f]{24}$/).gen(),
                name: "folder name",
                description: "folder description"
            };
            request.put('/v1/folders/id')
                .send(data)
                .end(function(err, res) {
                    if (err) throw err;
                    res.status.should.be.equal(200);
                    done();
                });
        });
    });
    
    describe('DELETE v1/folders/:folder', function() {
        it('should return 500', function(done) {
            folderServiceStub.getFolder = function(user, id, done) {
                return done({ message: 'Mongoose error' });
            };
            request.delete('/v1/folders/id')
                .end(function(err, res) {
                    if (err) throw err;
                    res.status.should.be.equal(500);
                    done();
                });
        });
        it('should return 500', function(done) {
            folderServiceStub.getFolder = function(user, id, done) {
                return done(null, {});
            };
            folderServiceStub.deleteFolder = function(user, id, done) {
                return done({ message: 'Mongoose error' });
            };
            request.delete('/v1/folders/id')
                .end(function(err, res) {
                    if (err) throw err;
                    res.status.should.be.equal(500);
                    done();
                });
        });
        it('should return 204', function(done) {
            folderServiceStub.getFolder = function(user, id, done) {
                return done(null, {});
            };
            folderServiceStub.deleteFolder = function(user, id, done) {
                return done();
            };
            var data = {
                parent: new randexp(/^[0-9a-f]{24}$/).gen(),
                name: "folder name",
                description: "folder description"
            };
            request.delete('/v1/folders/id')
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