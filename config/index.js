var environment = process.env.NODE_ENV;

module.exports = require('./env/' + (environment || 'development'));  
console.log('[Overview API] Initialized ' + (environment || 'development') + ' environment');
