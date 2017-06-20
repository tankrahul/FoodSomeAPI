var model = require('../models/model');
var HOSPITAL_DETAIL = model.hospitalDetail;
var HOSPITAL_CATEGORY = model.hospitalCategory;
var ObjectID = require('mongodb').ObjectID;
var Common = require('../routes/commonroute');

exports.findByQuery = _findByQuery;
exports.findById = _findById;
exports.saveByQuery = _saveByQuery;
exports.updateByQuery = _updateByQuery;

//TODO : find by query
function _findByQuery(modelName, condition, param, callback) {
    var json = {};

    modelName.find(condition, param, function (err, result) {
        if (err) {
            json.status = '0';
            json.result = { 'msg': JSON.stringify(err) };
            callback(json, null);
        }
        else {
            console.log("result :"+result);
            result.status = '1';
            callback(null, result);
        }
    });
}

//TODO : findOne by Id 

function _findById(modelName, Id, param, callback) {
    var json = {};
    modelName.findOne({ _id: new ObjectID(Id) }, param, function (err, result) {
        if (err) {
            json.status = '0';
            json.result = { 'msg': JSON.stringify(err) };
            callback(json, null);
        }
        else {
            result.status = '1';
            callback(null, result);
        }
    });
}


//TODO : insert by query 

function _saveByQuery(object, callback) {
    var json = {};
    object.save(function (err, result) {
        if (err) {
            json.status = '0';
            json.result = { 'msg': JSON.stringify(err) };
            Common.redirectWithJSON(req, res, '0', JSON.stringify(err));
            callback(json, null);
        }
        else {
            json.status = '1';
            callback(null, json);
        }
    });
}

//TODO : update by query

function _updateByQuery(modelName, object, id, callback) {
    var json = {};
    modelName.update({ _id: new ObjectID(id) }, { $set: object }, function (err, result) {
        if (err) {
            json.status = '0';
            json.result = { 'msg': JSON.stringify(err) };
            Common.redirectWithJSON(req, res, '0', JSON.stringify(err));
            callback(json, null);
        }
        else {
            json.status = '1';
            callback(null, json);
        }
    });
}
