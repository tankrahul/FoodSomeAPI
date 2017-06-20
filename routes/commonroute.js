var model = require('../models/model');
var COMMON_SERVICES = require('../services/commonService');
var commonPath = require('../common/path');
var Common = require('../routes/commonroute');
var fs = require('fs');

exports.pushMessage = _pushMessage;
exports.ensureUserInSession = _ensureUserInSession;
exports.redirectWithJSON = _redirectWithJSON;
exports.imageUpload = _imageUpload
exports.removeImageById = _removeImageById

function _pushMessage(req, type, message) {

}

/*
TODO:To Ensure that user in session or not
*/

function _ensureUserInSession(req, res, userReturnFunction) {
    if (req.session.user != 'undefined' && req.session.user != null) {
        userReturnFunction(req.session.user);
    } else {
        req.session = null;
        res.redirect('/login');
    }
}

/*
TODO:To alert box set redirect  only set session 
*/

function _redirectWithJSON(req, res, status, msg) {
    var json = {};
    json.status = status;
    json.result = { 'msg': msg };
    res.send(json);
}

function _imageUpload(imagePathForRead, imageNameWithUploadFolderPath, callback) {

    fs.readFile(imagePathForRead, function (err, data) {
        if (err) {
            console.log("err :" + err);
            Common.redirectWithJSON(req, res, '0', JSON.stringify(err));
            callback("err", null);
        } else {
            fs.writeFile(imageNameWithUploadFolderPath, data, function (err, result) {
                if (err) {
                    console.log("err :" + err);
                    Common.redirectWithJSON(req, res, '0', JSON.stringify(err));
                    callback("err", null);
                }
                else {
                    callback(null, 'done');
                }
            });
        }
    });

}


//TODO : Image Remove

function _removeImageById(ModelName, id, param, imageParam, callback) {
    var json = {};
    COMMON_SERVICES.findById(ModelName, id, param, function (err, result) {
        if (err) {
            Common.redirectWithJSON(req, res, '0', JSON.stringify(err));
            callback(json, null);
        }
        else {
            console.log("result : " + JSON.stringify(result));
            var imgName = result[imageParam];
            console.log("result imgName : " + imgName);
            if (imgName != null && imageParam != '' && imgName != 'undefined') {
                var path = commonPath.PROFILE_IMAGE + '/' + imgName;
                fs.unlink(path, function (err, res) {
                    if (err) {
                        Common.redirectWithJSON(req, res, '0', JSON.stringify(err));
                        console.log("empty image called !!");
                        callback(json, null);

                    }
                    else {
                        console.log("empty image called !!");
                        callback(null, 'done');
                    }
                });
                // fs.unlink(path);
                // console.log("if image called !!");
                // callback(null, 'done');
            }
            else {
                console.log("empty image called !!");
                callback(null, 'done');
            }
        }
    });
}