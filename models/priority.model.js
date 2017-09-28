// models/priority.model.js

var mongoose = require('mongoose');
var idValidator = require('mongoose-id-validator');

var PrioritySchema = new mongoose.Schema({
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
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
PrioritySchema.plugin(idValidator);

PrioritySchema.pre('save', function(done) {
    var priority = this;
    priority.updated_at = Date.now();
    if(priority.isNew) {
        priority.created_at = Date.now();
    }
    return done();
});

exports.schema = PrioritySchema;
exports.model = mongoose.model('Priority', PrioritySchema);