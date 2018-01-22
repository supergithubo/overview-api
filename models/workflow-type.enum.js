// models/workflow-type.enum.js

var Enum = require('enum');

var ens = new Enum([
  'DEFERRED', 'ACTIVE', 'COMPLETED', 'CHECKING'
]);

var keys = [];
ens.enums.forEach(function(enumItem) {
  keys.push(enumItem.key);
});

exports.enum = ens;
exports.keys = keys;
