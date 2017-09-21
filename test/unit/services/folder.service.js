var dir = '../../';

var should = require('should');
var proxyquire = require('proxyquire');
var randexp = require('randexp');

var Folder = require(dir + '../models/folder.model').model;

describe('unit/services/folder.service', function() {
  
    var FolderStub;
    var folderService;
    var user_id = new randexp(/^[a-fA-F0-9]{24}$/).gen();
    var folder_id = new randexp(/^[a-fA-F0-9]{24}$/).gen();
  
    before(function(done) {
        FolderStub = {};
        folderService = proxyquire(dir + '../services/folder.service', {
            '../models/folder.model': FolderStub
        })();

        done();
    });
    
    describe('getFolders', function() {
        it('should get', function(done) {
            FolderStub.model.find = function(obj, callback) {
                return callback(null, [{ _id: folder_id, account: obj.account }]);
            };
            folderService.getFolders({ _id: user_id }, function(err, folders) {
                should.not.exist(err);
                folders[0]._id.should.be.equal(folder_id);
                folders[0].account.should.be.equal(user_id);
                done();
            });
        });
        it('should not get any due to error', function(done) {
            FolderStub.model.find = function(obj, callback) {
                return callback({ error: 'some error' });
            };
            folderService.getFolders({ _id: user_id }, function(err, folders) {
                should.exist(err);
                should.not.exist(folders);
                done();
            });
        });
    });
    
    describe('saveFolder ', function() {
        it('should save', function(done) {
            var folder = {
                save: function(callback) {
                    return callback(null, { _id: folder_id, account: this.account });
                }
            }
            folderService.saveFolder({ _id: user_id }, folder, function(err, folder) {
                should.not.exist(err);
                folder._id.should.be.equal(folder_id);
                folder.account.should.be.equal(user_id);
                done();
            });
        });
        it('should not save due to error', function(done) {
            var folder = {
                save: function(callback) {
                    return callback({ error: 'some error' });
                }
            }
            folderService.saveFolder({ _id: user_id }, folder, function(err, folder) {
                should.exist(err);
                should.not.exist(folder);
                done();
            });
        });
    });
    
    describe('getFolder ', function() {
        it('should get', function(done) {
            FolderStub.model.findOne = function(obj, callback) {
                return callback(null, { _id: obj._id, account: obj.account });
            };
            folderService.getFolder({ _id: user_id }, folder_id, function(err, folder) {
                should.not.exist(err);
                folder._id.should.be.equal(folder_id);
                folder.account.should.be.equal(user_id);
                done();
            });
        });
        it('should not get any', function(done) {
            FolderStub.model.findOne = function(obj, callback) {
                return callback();
            };
            folderService.getFolder({ _id: user_id }, folder_id, function(err, folder) {
                should.not.exist(err);
                folder.should.be.equal(false);
                done();
            });
        });
        it('should not get any due to error', function(done) {
            FolderStub.model.findOne = function(obj, callback) {
                return callback({ error: 'some error' });
            };
            folderService.getFolder({ _id: user_id }, folder_id, function(err, folder) {
                should.exist(err);
                should.not.exist(folder);
                done();
            });
        });
    });
    
    describe('deleteFolder ', function() {
        it('should delete', function(done) {
            FolderStub.model.findOne = function(obj, callback) {
                return callback(null, { _id: obj._id, account: obj.account });
            };
            FolderStub.model.remove = function(obj, callback) {
                return callback(null);
            };
            folderService.deleteFolder({ _id: user_id }, folder_id, function(err, deleted) {
                should.not.exist(err);
                deleted.should.be.equal(true);
                done();
            });
        });
        it('should not delete any', function(done) {
            FolderStub.model.findOne = function(obj, callback) {
                return callback();
            };
            folderService.deleteFolder({ _id: user_id }, folder_id, function(err, deleted) {
                should.not.exist(err);
                deleted.should.be.equal(false);
                done();
            });
        });
        it('should not delete due to error on finding', function(done) {
            FolderStub.model.findOne = function(obj, callback) {
                return callback({ error: 'some error' });
            };
            folderService.deleteFolder({ _id: user_id }, folder_id, function(err, deleted) {
                should.exist(err);
                should.not.exist(deleted);
                done();
            });
        });
        it('should not delete due to error on deletion', function(done) {
            FolderStub.model.findOne = function(obj, callback) {
                return callback(null, { _id: obj._id, account: obj.account });
            };
            FolderStub.model.remove = function(obj, callback) {
                return callback({ error: 'some error' });
            };
            folderService.deleteFolder({ _id: user_id }, folder_id, function(err, deleted) {
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