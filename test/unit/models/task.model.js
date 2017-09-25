var dir = "../../";

var should = require('should');
var proxyquire = require('proxyquire');
var randexp = require('randexp');
var mongoose = require('mongoose');

var config = require(dir + '../config');
var Task = require(dir + '../models/task.model').model;
var clearDB = require('mocha-mongoose')(config.db.uri, {
    noClear: true
});

describe('unit/models/task.model', function() {
  
    before(function(done) {
        mongoose.Promise = global.Promise;
        mongoose.connect(config.db.uri, { useMongoClient: true });
        clearDB(done);
    });
    
    describe('model save', function() {
        it('should satisfy task with folder, name & description', function(done) {
            var task = new Task();
            task.folder = new randexp(/^[0-9a-f]{24}$/).gen();
            task.name = 'task name';
            task.description = 'task description';
            
            task.save(function(err, f) {
                if(err) throw err;
                f.folder.should.be.equal(task.folder);
                f.name.should.be.equal(task.name);
                f.description.should.be.equal(task.description);
                should.exist(task.__v);
                should.exist(task._id);
                should.exist(task.color);
                should.exist(task.updated_at);
                should.exist(task.created_at);
                done();
            })
        });
        it('should require task folder & name', function(done) {
            var task = new Task();
            task.description = 'task description';
            task.save(function(err, f) {
                should.exist(err.errors['folder']);
                should.exist(err.errors['name']);
                done();
            })
        });
        it('should require task name & description', function(done) {
            var task = new Task();
            task.folder = new randexp(/^[0-9a-f]{24}$/).gen();
            task.save(function(err, f) {
                should.exist(err.errors['name']);
                should.exist(err.errors['description']);
                done();
            })
        });
        it('should require task folder & description', function(done) {
            var task = new Task();
            task.name = 'name';
            task.save(function(err, f) {
                should.exist(err.errors['folder']);
                should.exist(err.errors['description']);
                done();
            })
        });
    });
    
    describe('model update', function() {
        it('should update updated_at and not created_at upon task update', function(done) {
            var task = new Task();
            task.folder = new randexp(/^[0-9a-f]{24}$/).gen();
            task.name = 'task name';
            task.description = 'task description';
            
            task.save(function(err, f) {
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