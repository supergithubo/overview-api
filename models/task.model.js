// models/task.model.js

var mongoose = require('mongoose');
var idValidator = require('mongoose-id-validator');

var TaskSchema = new mongoose.Schema({
    folder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Folder',
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
    due_date: {
        type: Date
    },
    priority: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Priority',
        required: true
    },
    status: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Workflow',
        required: true
    },
    color: {
        type: String,
        default: '#f3f3f3'
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
TaskSchema.plugin(idValidator);

TaskSchema.pre('save', function(done) {
    var task = this;
    task.updated_at = Date.now();
    if(task.isNew) {
        task.created_at = Date.now();
    }
    return done();
});

exports.schema = TaskSchema;
exports.model = mongoose.model('Task', TaskSchema);