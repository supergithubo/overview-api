var dir = "../../";

var should = require('should');
var proxyquire = require('proxyquire');
var randexp = require('randexp');
var mongoose = require('mongoose');

var config = require(dir + '../config');
var Workflow = require(dir + '../models/workflow.model').model;
var type = require(dir + '../models/workflow-type.enum');
var clearDB = require('mocha-mongoose')(config.db.uri, {
    noClear: true
});

describe('unit/models/workflow.model', function() {
  
    before(function(done) {
        mongoose.Promise = global.Promise;
        mongoose.connect(config.db.uri, { useMongoClient: true });
        clearDB(done);
    });
    
    describe('model save', function() {
        it('should satisfy workflow with account, name & type', function(done) {
            var workflow = new Workflow();
            workflow.account = new randexp(/^[0-9a-f]{24}$/).gen(),
            workflow.name = 'workflow name';
            workflow.type = type.enum.DEFERRED.key;
            
            workflow.save(function(err, f) {
                if(err) throw err;
                f.account.should.be.equal(workflow.account);
                f.name.should.be.equal(workflow.name);
                should.exist(workflow.__v);
                should.exist(workflow._id);
                should.exist(workflow.updated_at);
                should.exist(workflow.created_at);
                done();
            })
        });
        it('should require workflow account & type', function(done) {
            var workflow = new Workflow();
            workflow.name = 'workflow name';
            
            workflow.save(function(err, f) {
                should.exist(err.errors['account']);
                should.exist(err.errors['type']);
                done();
            })
        });
        it('should require workflow name & type', function(done) {
            var workflow = new Workflow();
            workflow.account = new randexp(/^[0-9a-f]{24}$/).gen(),
            
            workflow.save(function(err, f) {
                should.exist(err.errors['name']);
                should.exist(err.errors['type']);
                done();
            })
        });
        it('should require workflow account & name', function(done) {
            var workflow = new Workflow();
            workflow.type = type.enum.DEFERRED.key;
            
            workflow.save(function(err, f) {
                should.exist(err.errors['account']);
                should.exist(err.errors['name']);   
                done();
            })
        });
    });
    
    describe('model update', function() {
        it('should update updated_at and not created_at upon workflow update', function(done) {
            var workflow = new Workflow();
            workflow.account = new randexp(/^[0-9a-f]{24}$/).gen(),
            workflow.name = 'workflow name';
            workflow.type = type.enum.DEFERRED.key;
            
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