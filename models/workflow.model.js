// models/workflow.model.js

var mongoose = require('mongoose');
var idValidator = require('mongoose-id-validator');

var type = require('./workflow-type.enum');

var WorkflowSchema = new mongoose.Schema({
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: {
            values: type.keys,
            message: '`{VALUE}` type currently not supported'
        },
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
WorkflowSchema.plugin(idValidator);

WorkflowSchema.pre('save', function(done) {
    var workflow = this;
    workflow.updated_at = Date.now();
    if(workflow.isNew) {
        workflow.created_at = Date.now();
    }
    return done();
});

exports.schema = WorkflowSchema;
exports.model = mongoose.model('Workflow', WorkflowSchema);