var dir = "../../";

var should = require('should');
var proxyquire = require('proxyquire');
var randexp = require('randexp');

var Priority = require(dir + '../models/priority.model').model;

describe('unit/services/priority.service', function() {
  
    var PriorityStub;
    var priorityService;
    var user_id = new randexp(/^[a-fA-F0-9]{24}$/).gen();
    var priority_id = new randexp(/^[a-fA-F0-9]{24}$/).gen();
  
    before(function(done) {
        PriorityStub = {};
        priorityService = proxyquire(dir + '../services/priority.service', {
            '../models/priority.model': PriorityStub
        })();

        done();
    });
    
    describe('getPriorities', function() {
        it('should get', function(done) {
            PriorityStub.model.find = function(obj, callback) {
                return callback(null, [{ _id: priority_id, account: obj.account }]);
            };
            priorityService.getPriorities({ _id: user_id }, function(err, priorities) {
                should.not.exist(err);
                priorities[0]._id.should.be.equal(priority_id);
                priorities[0].account.should.be.equal(user_id);
                done();
            });
        });
        it('should not get any due to error', function(done) {
            PriorityStub.model.find = function(obj, callback) {
                return callback({ error: 'some error' });
            };
            priorityService.getPriorities({ _id: user_id }, function(err, priorities) {
                should.exist(err);
                should.not.exist(priorities);
                done();
            });
        });
    });
    
    describe('savePriority ', function() {
        it('should save', function(done) {
            var priority = {
                save: function(callback) {
                    return callback(null, { _id: priority_id, account: this.account });
                }
            }
            priorityService.savePriority({ _id: user_id }, priority, function(err, priority) {
                should.not.exist(err);
                priority._id.should.be.equal(priority_id);
                priority.account.should.be.equal(user_id);
                done();
            });
        });
        it('should not save due to error', function(done) {
            var priority = {
                save: function(callback) {
                    return callback({ error: 'some error' });
                }
            }
            priorityService.savePriority({ _id: user_id }, priority, function(err, priority) {
                should.exist(err);
                should.not.exist(priority);
                done();
            });
        });
    });
    
    describe('getPriority ', function() {
        it('should get', function(done) {
            PriorityStub.model.findOne = function(obj, callback) {
                return callback(null, { _id: obj._id, account: obj.account });
            };
            priorityService.getPriority({ _id: user_id }, priority_id, function(err, priority) {
                should.not.exist(err);
                priority._id.should.be.equal(priority_id);
                priority.account.should.be.equal(user_id);
                done();
            });
        });
        it('should not get any', function(done) {
            PriorityStub.model.findOne = function(obj, callback) {
                return callback();
            };
            priorityService.getPriority({ _id: user_id }, priority_id, function(err, priority) {
                should.not.exist(err);
                priority.should.be.equal(false);
                done();
            });
        });
        it('should not get any due to error', function(done) {
            PriorityStub.model.findOne = function(obj, callback) {
                return callback({ error: 'some error' });
            };
            priorityService.getPriority({ _id: user_id }, priority_id, function(err, priority) {
                should.exist(err);
                should.not.exist(priority);
                done();
            });
        });
    });
    
    describe('deletePriority ', function() {
        it('should delete', function(done) {
            PriorityStub.model.findOne = function(obj, callback) {
                return callback(null, { _id: obj._id, account: obj.account });
            };
            PriorityStub.model.remove = function(obj, callback) {
                return callback(null);
            };
            priorityService.deletePriority({ _id: user_id }, priority_id, function(err, deleted) {
                should.not.exist(err);
                deleted.should.be.equal(true);
                done();
            });
        });
        it('should not delete any', function(done) {
            PriorityStub.model.findOne = function(obj, callback) {
                return callback();
            };
            priorityService.deletePriority({ _id: user_id }, priority_id, function(err, deleted) {
                should.not.exist(err);
                deleted.should.be.equal(false);
                done();
            });
        });
        it('should not delete due to error on finding', function(done) {
            PriorityStub.model.findOne = function(obj, callback) {
                return callback({ error: 'some error' });
            };
            priorityService.deletePriority({ _id: user_id }, priority_id, function(err, deleted) {
                should.exist(err);
                should.not.exist(deleted);
                done();
            });
        });
        it('should not delete due to error on deletion', function(done) {
            PriorityStub.model.findOne = function(obj, callback) {
                return callback(null, { _id: obj._id, account: obj.account });
            };
            PriorityStub.model.remove = function(obj, callback) {
                return callback({ error: 'some error' });
            };
            priorityService.deletePriority({ _id: user_id }, priority_id, function(err, deleted) {
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