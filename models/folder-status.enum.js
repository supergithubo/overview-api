// models/folder-status.enum.js

var Enum = require('enum');

var ens = new Enum([
    'PLAN', 'DEVEL', 'CURRENT', 'SUPPORT', 'LEGACY',
    'PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED'
]);

var keys = [];
ens.enums.forEach(function(enumItem) {
    keys.push(enumItem.key);
});

exports.enum = ens;
exports.keys = keys;