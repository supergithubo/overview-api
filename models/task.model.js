// models/task.model.js

var mongoose = require('mongoose');

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
    start_date: {
        type: Date
    },
    end_date: {
        type: Date
    },
    due_date: {
        type: Date
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