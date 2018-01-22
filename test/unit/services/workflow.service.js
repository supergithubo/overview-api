var dir = '../../';

var should = require('should');
var proxyquire = require('proxyquire');
var randexp = require('randexp');

var Workflow = require(dir + '../models/workflow.model').model;

describe('unit/services/workflow.service', function() {

  var WorkflowStub;
  var workflowService;
  var user_id = new randexp(/^[a-fA-F0-9]{24}$/).gen();
  var workflow_id = new randexp(/^[a-fA-F0-9]{24}$/).gen();

  before(function(done) {
    WorkflowStub = {};
    workflowService = proxyquire(dir + '../services/workflow.service', {
      '../models/workflow.model': WorkflowStub
    })();

    done();
  });

  describe('getWorkflows', function() {
    it('should get', function(done) {
      WorkflowStub.model.find = function(obj, callback) {
        return callback(null, [{ _id: workflow_id, account: obj.account }]);
      };
      workflowService.getWorkflows({ _id: user_id }, function(err, workflows) {
        should.not.exist(err);
        workflows[0]._id.should.be.equal(workflow_id);
        workflows[0].account.should.be.equal(user_id);
        done();
      });
    });
    it('should not get any due to error', function(done) {
      WorkflowStub.model.find = function(obj, callback) {
        return callback({ error: 'some error' });
      };
      workflowService.getWorkflows({ _id: user_id }, function(err, workflows) {
        should.exist(err);
        should.not.exist(workflows);
        done();
      });
    });
  });

  describe('saveWorkflow ', function() {
    it('should save', function(done) {
      var workflow = {
        save: function(callback) {
          return callback(null, { _id: workflow_id, account: this.account });
        }
      };
      workflowService.saveWorkflow({ _id: user_id }, workflow, function(err, workflow) {
        should.not.exist(err);
        workflow._id.should.be.equal(workflow_id);
        workflow.account.should.be.equal(user_id);
        done();
      });
    });
    it('should not save due to error', function(done) {
      var workflow = {
        save: function(callback) {
          return callback({ error: 'some error' });
        }
      };
      workflowService.saveWorkflow({ _id: user_id }, workflow, function(err, workflow) {
        should.exist(err);
        should.not.exist(workflow);
        done();
      });
    });
  });

  describe('getWorkflow ', function() {
    it('should get', function(done) {
      WorkflowStub.model.findOne = function(obj, callback) {
        return callback(null, { _id: obj._id, account: obj.account });
      };
      workflowService.getWorkflow({ _id: user_id }, workflow_id, function(err, workflow) {
        should.not.exist(err);
        workflow._id.should.be.equal(workflow_id);
        workflow.account.should.be.equal(user_id);
        done();
      });
    });
    it('should not get any', function(done) {
      WorkflowStub.model.findOne = function(obj, callback) {
        return callback();
      };
      workflowService.getWorkflow({ _id: user_id }, workflow_id, function(err, workflow) {
        should.not.exist(err);
        workflow.should.be.equal(false);
        done();
      });
    });
    it('should not get any due to error', function(done) {
      WorkflowStub.model.findOne = function(obj, callback) {
        return callback({ error: 'some error' });
      };
      workflowService.getWorkflow({ _id: user_id }, workflow_id, function(err, workflow) {
        should.exist(err);
        should.not.exist(workflow);
        done();
      });
    });
  });

  describe('deleteWorkflow ', function() {
    it('should delete', function(done) {
      WorkflowStub.model.findOne = function(obj, callback) {
        return callback(null, { _id: obj._id, account: obj.account });
      };
      WorkflowStub.model.remove = function(obj, callback) {
        return callback(null);
      };
      workflowService.deleteWorkflow({ _id: user_id }, workflow_id, function(err, deleted) {
        should.not.exist(err);
        deleted.should.be.equal(true);
        done();
      });
    });
    it('should not delete any', function(done) {
      WorkflowStub.model.findOne = function(obj, callback) {
        return callback();
      };
      workflowService.deleteWorkflow({ _id: user_id }, workflow_id, function(err, deleted) {
        should.not.exist(err);
        deleted.should.be.equal(false);
        done();
      });
    });
    it('should not delete due to error on finding', function(done) {
      WorkflowStub.model.findOne = function(obj, callback) {
        return callback({ error: 'some error' });
      };
      workflowService.deleteWorkflow({ _id: user_id }, workflow_id, function(err, deleted) {
        should.exist(err);
        should.not.exist(deleted);
        done();
      });
    });
    it('should not delete due to error on deletion', function(done) {
      WorkflowStub.model.findOne = function(obj, callback) {
        return callback(null, { _id: obj._id, account: obj.account });
      };
      WorkflowStub.model.remove = function(obj, callback) {
        return callback({ error: 'some error' });
      };
      workflowService.deleteWorkflow({ _id: user_id }, workflow_id, function(err, deleted) {
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
