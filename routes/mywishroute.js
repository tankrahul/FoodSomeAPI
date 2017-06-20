var model = require('../models/model');
var comPath = require('../common/path');
var MYWISH_DETAIL = model.mywishs;
var Common = require('./commonroute');
var fs = require('fs');
var ObjectID = require('mongodb').ObjectID;
var MYWISH_SERVICES = require('../services/mywishService');
var COMMON_SERVICES = require('../services/commonService');
var constant = require('../common/constant');

/** --------------------------------------- */
exports.getMywishs = _getMywishs;
exports.addMywish = _addMywish;
exports.deleteMywish = _deleteMywish;

// TODO: when / called
// METHOD : GET
function _getMywishs(req, res, next) {
    var json = {};
    var param = {};
    var condition = { IsDeleted: false };
    COMMON_SERVICES.findByQuery(MYWISH_DETAIL, condition, param, function (err, mywishs) {
        if (err) {
            Common.redirectWithJSON(req, res, '0', 'err while get Mywish :' + JSON.stringify(err));
        }
        else {
            json.status = '1';
            json.mywishs = mywishs;
            console.log(JSON.stringify(mywishs));
            res.send(json);
        }
    });
}

// TO DO :add mywish detail
// METHOD : POST
function _addMywish(req, res) {
    var json = {};
    console.log("req.body" + JSON.stringify(req.body));
    MYWISH_SERVICES.mywishGetModelObject(req.body.restaurantId, req.body.offerId, req.body.restaurantName, req.body.offerTitle,
        function (object) {
            console.log("object :" + JSON.stringify(object));
            save(object);
        }
    );

    function save(object) {
        var obj = new MYWISH_DETAIL(object);
        COMMON_SERVICES.saveByQuery(obj, function (err, result) {
            if (err) {
                Common.redirectWithJSON(req, res, '0', 'err while mywish save data :' + JSON.stringify(err));
            }
            else {
                Common.redirectWithJSON(req, res, '1', 'Mywish Add Successfully');
            }
        });
    }

}



// TODO: delete Mywish 
// METHOD : POST
function _deleteMywish(req, res, next) {
    var mywishId = req.body.mywishId;
    var json = {};
    var object = { IsDeleted: true };
    COMMON_SERVICES.updateByQuery(MYWISH_DETAIL, object, mywishId, function (err, result) {
        if (err) {
            Common.redirectWithJSON(req, res, '0', 'Mywish Delete err : '+JSON.stringify(err));
        }
        else {
            Common.redirectWithJSON(req, res, '1', 'Mywish Delete Successfully');
         }
    });
}

