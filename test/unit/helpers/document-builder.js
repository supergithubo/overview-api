var dir = '../../';

var should = require('should');
var randexp = require('randexp');

var Folder = require(dir + '../models/folder.model').model;
var status = require(dir + '../models/folder-status.enum');
var builder = require(dir + '../helpers/document-builder');

describe('unit/helpers/document-builder', function() {
  
    var folder;
    before(function(done) {
        done();
    });
    
    function compareAttr(obj, obj2, except = '') {
        var attr = Object.keys(obj.toObject());
        for(var i = 0; i < attr.length; i++) {
            var key = attr[i];
            var exceptArray = except.split(',');
            if(key !== '_id' && exceptArray.indexOf(key) < 0) {
                //console.log(key + ': ' + obj2[key] + " == " + obj[key]);
                var obj2_val = obj2[key];
                var obj_val = obj[key];
            }
        }
    }
    
    describe('update', function() {
        it('should update new schema from req body', function(done) {
            var body = {
                account: new randexp(/^[0-9a-f]{24}$/).gen(),
                name: 'name',
                description: 'description',
                is_root: false,
                updated_at: new Date(),
                created_at: new Date()
            };
            folder = new Folder();
            builder.build(folder, Folder, body);

            compareAttr(folder, body);
            should.exist(folder._id);
            done();
        });
        it('should update existing schema from req body except _id', function(done) {
            var body = {
                _id: new randexp(/^[0-9a-f]{24}$/).gen(),
                account: new randexp(/^[0-9a-f]{24}$/).gen(),
                name: 'name update',
                description: 'description update',
                is_root: true,
                updated_at: new Date(),
                created_at: new Date()
            };
            builder.build(folder, Folder, body);
            
            compareAttr(folder, body);
            body._id.should.not.be.equal(folder._id);
            done();
        });
        it('should update existing schema from req body except _id & specified attrs', function(done) {
            var body = {
                _id: new randexp(/^[0-9a-f]{24}$/).gen(),
                account: new randexp(/^[0-9a-f]{24}$/).gen(),
                name: 'name update 2',
                description: 'description update 2',
                is_root: false,
                updated_at: new Date(),
                created_at: new Date()
            };
            builder.build(folder, Folder, body, 'is_root,description');
            
            compareAttr(folder, body, 'is_root,description');
            body._id.should.not.be.equal(folder._id);
            body.is_root.should.not.be.equal(folder.is_root);
            body.description.should.not.be.equal(folder.description);
            done();
        });
    });
    
    describe('update nested', function() {
        it('should update new schema from req body', function(done) {
            var body = {
                _id: new randexp(/^[0-9a-f]{24}$/).gen(),
                account: new randexp(/^[0-9a-f]{24}$/).gen(),
                name: 'name',
                description: 'description',
                is_root: false,
                project: {
                    name: 'name',
                    description: 'desc',
                    start_date: new Date(),
                    end_date: new Date(),
                    status: status.enum.PENDING.key
                },
                updated_at: new Date(),
                created_at: new Date()
            };
            folder = new Folder();
            builder.build(folder, Folder, body);
            
            compareAttr(folder, body, 'project');
            compareAttr(folder.project, body.project, 'required');
            
            should.exist(folder._id);
              done();
        });
        it('should update existing schema from req body except _id & specified attrs', function(done) {
            var body = {
                _id: new randexp(/^[0-9a-f]{24}$/).gen(),
                account: new randexp(/^[0-9a-f]{24}$/).gen(),
                name: 'name update 2',
                description: 'description update 2',
                is_root: true,
                project: {
                    name: 'name 2 ',
                    description: 'desc 2',
                    start_date: new Date(),
                    end_date: new Date(),
                    status: status.enum.PENDING.key
                },
                updated_at: new Date(),
                created_at: new Date()
            };
            
            builder.build(folder, Folder, body, 'is_root,description,project.start_date');
            
            compareAttr(folder, body, 'is_root,description,project');
            compareAttr(folder.project, body.project, 'start_date');
            
            body._id.should.not.be.equal(folder._id);
            body.is_root.should.not.be.equal(folder.is_root);
            body.description.should.not.be.equal(folder.description);
            body.project.start_date.should.not.be.equal(folder.project.start_date);
            done();
        });
    });
    
    after(function(done) {
        done();
    });
});