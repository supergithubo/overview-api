var _ = require('underscore');

exports.build = function(doc, SchemaTarget, data, safe = '') {
    var safeFields = safe.split(',');
    for (var field in SchemaTarget.schema.paths) {
        if ((field !== '_id') && (field !== '__v') && (safeFields.indexOf(field) < 0)) {
            var newValue = getObjValue(field, data);
            //console.log('data[' + field + '] = ' + newValue);
            if (newValue !== undefined) {
                setObjValue(field, doc, newValue);
            }
        }
    }
    return doc;
};

function getObjValue(field, data) {
    return _.reduce(field.split("."), function(obj, f) {
        if(obj) return obj[f];
    }, data);
}

function setObjValue(field, data, value) {
    var fieldArr = field.split('.');
    return _.reduce(fieldArr, function(o, f, i) {
       if(i == fieldArr.length-1) {
            o[f] = value;
       } else {
            if(!o[f]) o[f] = {};
       }
       return o[f];
    }, data);
}