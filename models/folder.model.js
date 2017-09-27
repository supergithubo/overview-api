// models/folder.model.js

var mongoose = require('mongoose');

var status = require('./folder-status.enum');

var FolderSchema = new mongoose.Schema({
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    is_project: {
        type: Boolean,
        required: true,
        default: false
    },
    project: {
        start_date: {
            type: Date,
            required: isProject
        },
        end_date: {
            type: Date
        },
        status: {
            type: String,
            enum: {
                values: status.keys,
                message: '`{VALUE}` status currently not supported'
            },
            required: isProject
        }
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Folder'
    },
    is_root: {
        type: Boolean,
        default: true
    },
    created_at: {
        type: Date, 
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

function isProject() {
    return this.is_project;
}

FolderSchema.pre('save', function(done) {
    var folder = this;
    folder.is_root = folder.parent ? false : true;
    folder.updated_at = Date.now();
    if(folder.isNew) {
        folder.created_at = Date.now();
    }
    if(!folder.is_project) {
        folder.project = undefined;
    }
    return done();
});

exports.schema = FolderSchema;
exports.model = mongoose.model('Folder', FolderSchema);