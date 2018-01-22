var dir = '../../';

var proxyquire = require('proxyquire');
var supertest = require('supertest');
var randexp = require('randexp');

var express = require('express');
var compression = require('compression');
var bodyParser = require('body-parser');
var validation = require('express-validation');

var config = require(dir + '../config');

describe('unit/routes/task.route', function() {

  var request;
  var folderServiceStub;
  var taskServiceStub;
  var folder;
  var task;

  before(function(done) {
    folder  = {
      _id: new randexp(/^[0-9a-f]{24}$/).gen(),
      name: 'folder name',
      description: 'folder description'
    };
    task = {
      _id: new randexp(/^[0-9a-f]{24}$/).gen(),
      folder: new randexp(/^[0-9a-f]{24}$/).gen(),
      name: 'task name',
      description: 'task description'
    };

    folderServiceStub = {};
    taskServiceStub = {};
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

    var taskRouter = proxyquire(dir + '../routes/task.route', {
      '../services/folder.service': function() {
        return folderServiceStub;
      },
      '../services/task.service': function() {
        return taskServiceStub;
      },
      'express-auth': function(opts) {
        return expressAuthStub;
      }
    })(config);

    app.use('/v1', [
      taskRouter
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

  describe('GET v1/tasks', function() {
    it('should return 500', function(done) {
      folderServiceStub.getFolder = function(user, id, done) {
        return done({ message: 'Mongoose error' });
      };
      taskServiceStub.getTasks = function(folder, done) {
        throw new Error('Should have not been called');
      };

      request.get('/v1/folders/' + folder._id + '/tasks')
        .end(function(err, res) {
          if (err) throw err;
          res.status.should.be.equal(500);
          done();
        });
    });
    it('should return 500', function(done) {
      folderServiceStub.getFolder = function(user, id, done) {
        return done(null, folder);
      };
      taskServiceStub.getTasks = function(folder, done) {
        return done({ message: 'Mongoose error' });
      };

      request.get('/v1/folders/' + folder._id + '/tasks')
        .end(function(err, res) {
          if (err) throw err;
          res.status.should.be.equal(500);
          done();
        });
    });
    it('should return 404', function(done) {
      folderServiceStub.getFolder = function(user, id, done) {
        return done(null, false);
      };
      taskServiceStub.getTasks = function(folder, done) {
        throw new Error('Should have not been called');
      };

      request.get('/v1/folders/' + folder._id + '/tasks')
        .end(function(err, res) {
          if (err) throw err;
          res.status.should.be.equal(404);
          done();
        });
    });
    it('should return 200', function(done) {
      folderServiceStub.getFolder = function(user, id, done) {
        return done(null, folder);
      };
      taskServiceStub.getTasks = function(folder, done) {
        return done(null, []);
      };

      request.get('/v1/folders/' + folder._id + '/tasks')
        .end(function(err, res) {
          if (err) throw err;
          res.status.should.be.equal(200);
          done();
        });
    });
  });

  describe('POST v1/tasks', function() {
    it('should return 500', function(done) {
      folderServiceStub.getFolder = function(user, id, done) {
        return done({ message: 'Mongoose error' });
      };
      taskServiceStub.saveTask = function(user, task, done) {
        throw new Error('Should have not been called');
      };

      request.post('/v1/folders/' + folder._id + '/tasks')
        .send(task)
        .end(function(err, res) {
          if (err) throw err;
          res.status.should.be.equal(500);
          done();
        });
    });
    it('should return 404', function(done) {
      folderServiceStub.getFolder = function(user, id, done) {
        return done(null, false);
      };
      taskServiceStub.saveTask = function(user, task, done) {
        throw new Error('Should have not been called');
      };

      request.post('/v1/folders/' + folder._id + '/tasks')
        .send(task)
        .end(function(err, res) {
          if (err) throw err;
          res.status.should.be.equal(404);
          done();
        });
    });
    it('should return 500', function(done) {
      folderServiceStub.getFolder = function(user, id, done) {
        return done(null, {});
      };
      taskServiceStub.saveTask = function(user, task, done) {
        return done({ message: 'Mongoose error' });
      };

      request.post('/v1/folders/' + folder._id + '/tasks')
        .send(task)
        .end(function(err, res) {
          if (err) throw err;
          res.status.should.be.equal(500);
          done();
        });
    });
    it('should return 422', function(done) {
      var data = {};

      folderServiceStub.getFolder = function(user, id, done) {
        return done(null, {});
      };
      taskServiceStub.saveTask = function(user, task, done) {
        throw new Error('Should have not been called');
      };

      request.post('/v1/folders/' + folder._id + '/tasks')
        .send(data)
        .end(function(err, res) {
          if (err) throw err;
          res.status.should.be.equal(422);
          res.body.errors[0].field[0].should.be.equal('name');
          res.body.errors[0].types[0].should.be.equal('any.required');
          res.body.errors[1].field[0].should.be.equal('description');
          res.body.errors[1].types[0].should.be.equal('any.required');
          done();
        });
    });
    it('should return 201', function(done) {
      folderServiceStub.getFolder = function(user, id, done) {
        return done(null, {});
      };
      taskServiceStub.saveTask = function(user, task, done) {
        return done(null, {});
      };

      request.post('/v1/folders/' + folder._id + '/tasks')
        .send(task)
        .end(function(err, res) {
          if (err) throw err;
          res.status.should.be.equal(201);
          done();
        });
    });
  });

  describe('GET v1/tasks/:task', function() {
    it('should return 500', function(done) {
      folderServiceStub.getFolder = function(user, id, done) {
        return done({ message: 'Mongoose error' });
      };
      taskServiceStub.getTask = function(folder, id, done) {
        throw new Error('Should have not been called');
      };

      request.get('/v1/folders/' + folder._id + '/tasks/' + task._id)
        .end(function(err, res) {
          if (err) throw err;
          res.status.should.be.equal(500);
          done();
        });
    });
    it('should return 404', function(done) {
      folderServiceStub.getFolder = function(user, id, done) {
        return done(null, false);
      };
      taskServiceStub.getTask = function(folder, id, done) {
        throw new Error('Should have not been called');
      };

      request.get('/v1/folders/' + folder._id + '/tasks/' + task._id)
        .end(function(err, res) {
          if (err) throw err;
          res.status.should.be.equal(404);
          done();
        });
    });
    it('should return 500', function(done) {
      folderServiceStub.getFolder = function(user, id, done) {
        return done(null, {});
      };
      taskServiceStub.getTask = function(folder, id, done) {
        return done({ message: 'Mongoose error' });
      };

      request.get('/v1/folders/' + folder._id + '/tasks/' + task._id)
        .end(function(err, res) {
          if (err) throw err;
          res.status.should.be.equal(500);
          done();
        });
    });
    it('should return 404', function(done) {
      folderServiceStub.getFolder = function(user, id, done) {
        return done(null, {});
      };
      taskServiceStub.getTask = function(folder, id, done) {
        return done(null, false);
      };

      request.get('/v1/folders/' + folder._id + '/tasks/' + task._id)
        .end(function(err, res) {
          if (err) throw err;
          res.status.should.be.equal(404);
          done();
        });
    });
    it('should return 200', function(done) {
      folderServiceStub.getFolder = function(user, id, done) {
        return done(null, {});
      };
      taskServiceStub.getTask = function(folder, id, done) {
        return done(null, {});
      };

      request.get('/v1/folders/' + folder._id + '/tasks/' + task._id)
        .end(function(err, res) {
          if (err) throw err;
          res.status.should.be.equal(200);
          done();
        });
    });
  });

  describe('PUT v1/tasks/:task', function() {
    it('should return 500', function(done) {
      folderServiceStub.getFolder = function(user, id, done) {
        return done({ message: 'Mongoose error' });
      };
      taskServiceStub.getTask = function(folder, id, done) {
        throw new Error('Should have not been called');
      };
      taskServiceStub.saveTask = function(user, task, done) {
        throw new Error('Should have not been called');
      };

      request.put('/v1/folders/' + folder._id + '/tasks/' + task._id)
        .send(task)
        .end(function(err, res) {
          if (err) throw err;
          res.status.should.be.equal(500);
          done();
        });
    });
    it('should return 404', function(done) {
      folderServiceStub.getFolder = function(user, id, done) {
        return done(null, false);
      };
      taskServiceStub.getTask = function(folder, id, done) {
        throw new Error('Should have not been called');
      };
      taskServiceStub.saveTask = function(user, task, done) {
        throw new Error('Should have not been called');
      };

      request.put('/v1/folders/' + folder._id + '/tasks/' + task._id)
        .send(task)
        .end(function(err, res) {
          if (err) throw err;
          res.status.should.be.equal(404);
          done();
        });
    });
    it('should return 500', function(done) {
      folderServiceStub.getFolder = function(user, id, done) {
        return done(null, {});
      };
      taskServiceStub.getTask = function(folder, id, done) {
        return done({ message: 'Mongoose error' });
      };
      taskServiceStub.saveTask = function(user, task, done) {
        throw new Error('Should have not been called');
      };

      request.put('/v1/folders/' + folder._id + '/tasks/' + task._id)
        .send(task)
        .end(function(err, res) {
          if (err) throw err;
          res.status.should.be.equal(500);
          done();
        });
    });
    it('should return 404', function(done) {
      folderServiceStub.getFolder = function(user, id, done) {
        return done(null, {});
      };
      taskServiceStub.getTask = function(folder, id, done) {
        return done(null, false);
      };

      request.get('/v1/folders/' + folder._id + '/tasks/' + task._id)
        .end(function(err, res) {
          if (err) throw err;
          res.status.should.be.equal(404);
          done();
        });
    });

    it('should return 500', function(done) {
      folderServiceStub.getFolder = function(user, id, done) {
        return done(null, {});
      };
      taskServiceStub.getTask = function(folder, id, done) {
        return done(null, {});
      };
      taskServiceStub.saveTask = function(user, task, done) {
        return done({ message: 'Mongoose error' });
      };

      request.put('/v1/folders/' + folder._id + '/tasks/' + task._id)
        .send(task)
        .end(function(err, res) {
          if (err) throw err;
          res.status.should.be.equal(500);
          done();
        });
    });
    it('should return 422', function(done) {
      var data = {
        name: '',
        description: ''
      };

      folderServiceStub.getFolder = function(user, id, done) {
        return done(null, {});
      };
      taskServiceStub.getTask = function(folder, id, done) {
        return done(null, {});
      };
      taskServiceStub.saveTask = function(user, task, done) {
        throw new Error('Should have not been called');
      };

      request.put('/v1/folders/' + folder._id + '/tasks/' + task._id)
        .send(data)
        .end(function(err, res) {
          if (err) throw err;
          res.status.should.be.equal(422);
          res.body.errors[0].field[0].should.be.equal('name');
          res.body.errors[0].types[0].should.be.equal('any.empty');
          res.body.errors[1].field[0].should.be.equal('description');
          res.body.errors[1].types[0].should.be.equal('any.empty');
          done();
        });
    });
    it('should return 200', function(done) {
      folderServiceStub.getFolder = function(user, id, done) {
        return done(null, {});
      };
      taskServiceStub.getTask = function(folder, id, done) {
        return done(null, {});
      };
      taskServiceStub.saveTask = function(user, task, done) {
        return done(null, {});
      };

      request.put('/v1/folders/' + folder._id + '/tasks/' + task._id)
        .send(task)
        .end(function(err, res) {
          if (err) throw err;
          res.status.should.be.equal(200);
          done();
        });
    });
  });

  describe('DELETE v1/tasks/:task', function() {
    it('should return 500', function(done) {
      folderServiceStub.getFolder = function(user, id, done) {
        return done({ message: 'Mongoose error' });
      };
      taskServiceStub.getTask = function(folder, id, done) {
        throw new Error('Should have not been called');
      };
      taskServiceStub.deleteTask = function(task, id, done) {
        throw new Error('Should have not been called');
      };

      request.delete('/v1/folders/' + folder._id + '/tasks/' + task._id)
        .end(function(err, res) {
          if (err) throw err;
          res.status.should.be.equal(500);
          done();
        });
    });
    it('should return 404', function(done) {
      folderServiceStub.getFolder = function(user, id, done) {
        return done(null, false);
      };
      taskServiceStub.getTask = function(folder, id, done) {
        throw new Error('Should have not been called');
      };
      taskServiceStub.deleteTask = function(task, id, done) {
        throw new Error('Should have not been called');
      };

      request.delete('/v1/folders/' + folder._id + '/tasks/' + task._id)
        .end(function(err, res) {
          if (err) throw err;
          res.status.should.be.equal(404);
          done();
        });
    });
    it('should return 500', function(done) {
      folderServiceStub.getFolder = function(user, id, done) {
        return done(null, {});
      };
      taskServiceStub.getTask = function(folder, id, done) {
        return done({ message: 'Mongoose error' });
      };
      taskServiceStub.deleteTask = function(task, id, done) {
        throw new Error('Should have not been called');
      };

      request.delete('/v1/folders/' + folder._id + '/tasks/' + task._id)
        .end(function(err, res) {
          if (err) throw err;
          res.status.should.be.equal(500);
          done();
        });
    });
    it('should return 404', function(done) {
      folderServiceStub.getFolder = function(user, id, done) {
        return done(null, {});
      };
      taskServiceStub.getTask = function(folder, id, done) {
        return done(null, false);
      };

      request.get('/v1/folders/' + folder._id + '/tasks/' + task._id)
        .end(function(err, res) {
          if (err) throw err;
          res.status.should.be.equal(404);
          done();
        });
    });

    it('should return 500', function(done) {
      folderServiceStub.getFolder = function(user, id, done) {
        return done(null, {});
      };
      taskServiceStub.getTask = function(folder, id, done) {
        return done(null, {});
      };
      taskServiceStub.deleteTask = function(task, id, done) {
        return done({ message: 'Mongoose error' });
      };

      request.delete('/v1/folders/' + folder._id + '/tasks/' + task._id)
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
      taskServiceStub.getTask = function(folder, id, done) {
        return done(null, {});
      };
      taskServiceStub.deleteTask = function(task, id, done) {
        return done();
      };

      request.delete('/v1/folders/' + folder._id + '/tasks/' + task._id)
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
