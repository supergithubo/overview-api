var dir = "../../";

var should = require('should');
var proxyquire = require('proxyquire');
var randexp = require('randexp');
var mongoose = require('mongoose');

var config = require(dir + '../config');
var Priority = require(dir + '../models/priority.model').model;
var clearDB = require('mocha-mongoose')(config.db.uri, {
    noClear: true
});

describe('unit/models/priority.model', function() {
  
    before(function(done) {
        mongoose.Promise = global.Promise;
        mongoose.connect(config.db.uri, { useMongoClient: true });
        clearDB(done);
    });
    
    describe('model save', function() {
        it('should satisfy priority with account, name & type', function(done) {
            var priority = new Priority();
            priority.account = new randexp(/^[0-9a-f]{24}$/).gen(),
            priority.name = 'priority name';
            
            priority.save(function(err, f) {
                if(err) throw err;
                f.account.should.be.equal(priority.account);
                f.name.should.be.equal(priority.name);
                should.exist(priority.__v);
                should.exist(priority._id);
                should.exist(priority.updated_at);
                should.exist(priority.created_at);
                done();
            })
        });
        it('should require priority account', function(done) {
            var priority = new Priority();
            priority.name = 'priority name';
            
            priority.save(function(err, f) {
                should.exist(err.errors['account']);
                done();
            })
        });
        it('should require priority name', function(done) {
            var priority = new Priority();
            priority.account = new randexp(/^[0-9a-f]{24}$/).gen(),
            
            priority.save(function(err, f) {
                should.exist(err.errors['name']);
                done();
            })
        });
    });
    
    describe('model update', function() {
        it('should update updated_at and not created_at upon priority update', function(done) {
            var priority = new Priority();
            priority.account = new randexp(/^[0-9a-f]{24}$/).gen(),
            priority.name = 'priority name';
            
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