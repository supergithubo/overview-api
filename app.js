// app.js

// Base Setup
// =============================================================================

var express = require('express');
var compression = require('compression');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var bearerToken = require('express-bearer-token');
var validation = require('express-validation');

var app = express();
var config = require('./config');

var expressAuth = require('express-auth')(config);

validation.options({
    status: 422,
    statusText: 'Unprocessable Entity'
});

app.use(compression());
app.use(bearerToken());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// Routes
// =============================================================================

var folderRouter = require('./routes/folder.route')(config);
var workflowRouter = require('./routes/workflow.route')(config);
var priorityRouter = require('./routes/priority.route')(config);
var taskRouter = require('./routes/task.route')(config);

app.use('/v1', [
    folderRouter, workflowRouter, priorityRouter, taskRouter,
    expressAuth.adminRouter, expressAuth.authRouter, expressAuth.selfRouter
]);

app.use(function(err, req, res, next) {
    if(err.name == 'ValidationError' || err.message == 'validation error') {
        return res.status(422).json(err);
    }
    
    return res.status(500).json(err);
});

// Server Start
// =============================================================================

var port = config.port;

var server = app.listen(port);
console.log('[Overview API] Listening on port ' + port);

// Database Start
// =============================================================================

mongoose.Promise = global.Promise;
mongoose.connect(config.db.uri, {
    useMongoClient: true
});

var db = mongoose.connection;

db.on('error', console.error.bind(console, '[Overview API] Connection error: '));
db.once('open', function() {
    console.log('[Overview API] Connected to database on ' + config.db.uri);
});

exports.server = server;