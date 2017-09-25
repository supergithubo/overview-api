var dir = "../../";

var should = require('should');
var proxyquire = require('proxyquire');
var randexp = require('randexp');
var mongoose = require('mongoose');

var config = require(dir + '../config');
var Folder = require(dir + '../models/folder.model').model;
var status = require(dir + '../models/folder-status.enum');
var clearDB = require('mocha-mongoose')(config.db.uri, {
    noClear: true
});

describe('unit/models/folder.model', function() {
  
    before(function(done) {
        mongoose.Promise = global.Promise;
        mongoose.connect(config.db.uri, { useMongoClient: true });
        clearDB(done);
    });
    
    describe('model save', function() {
        it('should satisfy folder with account, name & description', function(done) {
            var folder = new Folder();
            folder.account = new randexp(/^[0-9a-f]{24}$/).gen(),
            folder.name = 'folder name';
            folder.description = 'folder description';
            folder.project = {
                name: 'project name',
                description: 'project description',
                start_date: Date.now(),
                end_date: Date.now(),
                status: status.enum.PENDING.key
            }
            
            folder.save(function(err, f) {
                if(err) throw err;
                f.account.should.be.equal(folder.account);
                f.name.should.be.equal(folder.name);
                f.description.should.be.equal(folder.description);
                f.is_root.should.be.equal(true);
                f.is_project.should.be.equal(false);
                f.project.toString().should.be.equal('undefined');
                should.exist(folder.__v);
                should.exist(folder._id);
                should.exist(folder.updated_at);
                should.exist(folder.created_at);
                done();
            })
        });
        it('should set folder root to false when parent is set', function(done) {
            var folder = new Folder();
            folder.account = new randexp(/^[0-9a-f]{24}$/).gen(),
            folder.name = 'folder name';
            folder.description = 'folder description';
            folder.parent= new randexp(/^[0-9a-f]{24}$/).gen(),
            
            folder.save(function(err, f) {
                if(err) throw err;
                f.account.should.be.equal(folder.account);
                f.name.should.be.equal(folder.name);
                f.description.should.be.equal(folder.description);
                f.is_root.should.be.equal(false);
                f.is_project.should.be.equal(false);
                f.project.toString().should.be.equal('undefined');
                should.exist(folder.__v);
                should.exist(folder._id);
                should.exist(folder.updated_at);
                should.exist(folder.created_at);
                done();
            })
        });
        it('should require folder account & name', function(done) {
            var folder = new Folder();
            folder.description = 'folder description';
            folder.save(function(err, f) {
                should.exist(err.errors['account']);
                should.exist(err.errors['name']);
                done();
            })
        });
        it('should require folder name & description', function(done) {
            var folder = new Folder();
            folder.account = new randexp(/^[0-9a-f]{24}$/).gen(),
            folder.save(function(err, f) {
                should.exist(err.errors['name']);
                should.exist(err.errors['description']);
                done();
            })
        });
        it('should require folder account & description', function(done) {
            var folder = new Folder();
            folder.name = 'name';
            folder.save(function(err, f) {
                should.exist(err.errors['account']);
                should.exist(err.errors['description']);
                done();
            })
        });
        it('should require folder project', function(done) {
            var folder = new Folder();
            folder.account = new randexp(/^[0-9a-f]{24}$/).gen(),
            folder.name = 'folder name';
            folder.description = 'folder description';
            folder.is_project = true;
            folder.save(function(err, f) {
                should.exist(err.errors['project.name']);
                should.exist(err.errors['project.description']);
                should.exist(err.errors['project.start_date']);
                should.exist(err.errors['project.status']);
                done();
            })
        });
        it('should satisfy folder with project', function(done) {
            var folder = new Folder();
            folder.account = new randexp(/^[0-9a-f]{24}$/).gen(),
            folder.name = 'folder name';
            folder.description = 'folder description';
            folder.is_project = true;
            folder.project = {
                name: 'project name',
                description: 'project description',
                start_date: Date.now(),
                end_date: Date.now(),
                status: status.enum.PENDING.key
            }
            
            folder.save(function(err, f) {
                if(err) throw err;
                f.account.should.be.equal(folder.account);
                f.name.should.be.equal(folder.name);
                f.description.should.be.equal(folder.description);
                f.is_root.should.be.equal(true);
                f.is_project.should.be.equal(true);
                should.exist(folder.__v);
                should.exist(folder._id);
                should.exist(folder.updated_at);
                should.exist(folder.created_at);
                should.exist(folder.project.name);
                should.exist(folder.project.description);
                should.exist(folder.project.start_date);
                should.exist(folder.project.status);
                done();
            })
        });
    });
    
    describe('model update', function() {
        it('should update updated_at and not created_at upon folder update', function(done) {
            var folder = new Folder();
            folder.account = new randexp(/^[0-9a-f]{24}$/).gen(),
            folder.name = 'folder name';
            folder.description = 'folder description';
            folder.project = {
                name: 'project name',
                description: 'project description',
                start_date: Date.now(),
                end_date: Date.now(),
                status: status.enum.PENDING.key
            }
            
            folder.save(function(err, f) {
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