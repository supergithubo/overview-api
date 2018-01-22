var dir = '../../';

var should = require('should');
var proxyquire = require('proxyquire');
var randexp = require('randexp');

describe('unit/services/task.service', function() {

  var TaskStub;
  var taskService;
  var folder_id = new randexp(/^[a-fA-F0-9]{24}$/).gen();
  var task_id = new randexp(/^[a-fA-F0-9]{24}$/).gen();

  before(function(done) {
    TaskStub = {};
    taskService = proxyquire(dir + '../services/task.service', {
      '../models/task.model': TaskStub
    })();

    done();
  });

  describe('getTasks', function() {
    it('should get', function(done) {
      TaskStub.model.find = function(obj, callback) {
        return callback(null, [{ _id: task_id, folder: obj.folder }]);
      };
      taskService.getTasks({ _id: folder_id }, function(err, tasks) {
        should.not.exist(err);
        tasks[0]._id.should.be.equal(task_id);
        tasks[0].folder.should.be.equal(folder_id);
        done();
      });
    });
    it('should not get any due to error', function(done) {
      TaskStub.model.find = function(obj, callback) {
        return callback({ error: 'some error' });
      };
      taskService.getTasks({ _id: folder_id }, function(err, tasks) {
        should.exist(err);
        should.not.exist(tasks);
        done();
      });
    });
  });

  describe('saveTask ', function() {
    it('should save', function(done) {
      var task = {
        save: function(callback) {
          return callback(null, { _id: task_id, folder: this.folder });
        }
      };
      taskService.saveTask({ _id: folder_id }, task, function(err, task) {
        should.not.exist(err);
        task._id.should.be.equal(task_id);
        task.folder.should.be.equal(folder_id);
        done();
      });
    });
    it('should not save due to error', function(done) {
      var task = {
        save: function(callback) {
          return callback({ error: 'some error' });
        }
      };
      taskService.saveTask({ _id: folder_id }, task, function(err, task) {
        should.exist(err);
        should.not.exist(task);
        done();
      });
    });
  });

  describe('getTask ', function() {
    it('should get', function(done) {
      TaskStub.model.findOne = function(obj, callback) {
        return callback(null, { _id: obj._id, folder: obj.folder });
      };
      taskService.getTask({ _id: folder_id }, task_id, function(err, task) {
        should.not.exist(err);
        task._id.should.be.equal(task_id);
        task.folder.should.be.equal(folder_id);
        done();
      });
    });
    it('should not get any', function(done) {
      TaskStub.model.findOne = function(obj, callback) {
        return callback();
      };
      taskService.getTask({ _id: folder_id }, task_id, function(err, task) {
        should.not.exist(err);
        task.should.be.equal(false);
        done();
      });
    });
    it('should not get any due to error', function(done) {
      TaskStub.model.findOne = function(obj, callback) {
        return callback({ error: 'some error' });
      };
      taskService.getTask({ _id: folder_id }, task_id, function(err, task) {
        should.exist(err);
        should.not.exist(task);
        done();
      });
    });
  });

  describe('deleteTask ', function() {
    it('should delete', function(done) {
      TaskStub.model.findOne = function(obj, callback) {
        return callback(null, { _id: obj._id, folder: obj.folder });
      };
      TaskStub.model.remove = function(obj, callback) {
        return callback(null);
      };
      taskService.deleteTask({ _id: folder_id }, task_id, function(err, deleted) {
        should.not.exist(err);
        deleted.should.be.equal(true);
        done();
      });
    });
    it('should not delete any', function(done) {
      TaskStub.model.findOne = function(obj, callback) {
        return callback();
      };
      taskService.deleteTask({ _id: folder_id }, task_id, function(err, deleted) {
        should.not.exist(err);
        deleted.should.be.equal(false);
        done();
      });
    });
    it('should not delete due to error on finding', function(done) {
      TaskStub.model.findOne = function(obj, callback) {
        return callback({ error: 'some error' });
      };
      taskService.deleteTask({ _id: folder_id }, task_id, function(err, deleted) {
        should.exist(err);
        should.not.exist(deleted);
        done();
      });
    });
    it('should not delete due to error on deletion', function(done) {
      TaskStub.model.findOne = function(obj, callback) {
        return callback(null, { _id: obj._id, folder: obj.folder });
      };
      TaskStub.model.remove = function(obj, callback) {
        return callback({ error: 'some error' });
      };
      taskService.deleteTask({ _id: folder_id }, task_id, function(err, deleted) {
        should.exist(err);
        should.not.exist(deleted);
        done();
      });
    });
  });

  after(function(done) {
    done();
  });
});
