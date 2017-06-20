var model = require('../models/model');
var comPath = require('../common/path');
var constant = require('../common/constant');

var Common = require('./commonroute');
var COMMON_SERVICES = require('../services/commonService');
var HOSPITAL_SERVICES = require('../services/hospitalService');
var HOSPITAL_DETAIL = model.hospitalDetail;
var HOSPITAL_CATEGORY = model.hospitalCategory;
var fs = require('fs');
var ObjectID = require('mongodb').ObjectID;

/** --------------------------------------- */
exports.getHospital = _getHospital;
exports.addHospital = _addHospital;
exports.editHospital = _editHospital;
exports.deleteHospital = _deleteHospital;
exports.getHospitalById = _getHospitalById;
exports.addNewCategory = _addNewCategory;

// TODO: when / called
function _getHospital(req, res, next) {

    Common.ensureUserInSession(req, res, function (caller) {

        var param = { hospitalImage: 1, hospitalName: 1, phoneNumber: 1, website: 1, hospitalCategory: 1 };
        var condition = { isDeleted: false };
        var alert;

        COMMON_SERVICES.findByQuery(HOSPITAL_DETAIL, condition, param, function (err, hospitals) {
            if (err) {
                res.render(constant.HOSPITAL_TYPE, {
                    path: req.path,
                    caller: caller,
                    hospitals: hospitals,
                    alert: err
                });
            }
            else {
                if (req.session.flage) {
                    req.session.flage = false;
                    alert = req.session.json;
                    req.session.json = null;
                }
                var hospitals = hospitals;
                param = { categoryName: 1 };
                COMMON_SERVICES.findByQuery(HOSPITAL_CATEGORY, condition, param, function (err, categorys) {
                    if (err) {
                        res.render(constant.HOSPITAL_TYPE, {
                            path: req.path,
                            caller: caller,
                            hospitals: categorys,
                            alert: err
                        });
                    }
                    else {
                        res.render(constant.HOSPITAL_TYPE, {
                            path: req.path,
                            caller: caller,
                            hospitals: hospitals,
                            categorys: categorys,
                            alert: alert
                        });
                    }
                });
            }
        });
    });
}

// TO DO :add hospital detail

function _addHospital(req, res) {
    Common.ensureUserInSession(req, res, function (caller) {
        var json = {};
        var image;
        var timestamp = new Date().getTime();
        if (req.files.image.name != "" && req.files.image.name != "undefined" && req.files.image.name != null) {
            var imagePath = req.files.image.path;
            image = timestamp + '.png';
        }

        HOSPITAL_SERVICES.hospitalGetModelObject(req.body.txthospitalName, image, req.body.txthospitalCategory, req.body.txtaddress, req.body.txtlandMark, req.body.txtpinCode, req.body.txtstate, req.body.txtcountry, req.body.txtphoneNumber, req.body.txtwebsite,
            function (object) {
                if (image) {
                    var newPath = comPath.PROFILE_IMAGE + image;
                    Common.imageUpload(imagePath, newPath, function (err, result) {
                        if (err) {
                            res.redirect('/getHospital');
                        } else {
                            save(object);
                        }
                    });
                } else {
                    save(object);
                }
            }
        );

        function save(object) {
            var obj = new HOSPITAL_DETAIL(object);
            COMMON_SERVICES.saveByQuery(obj, function (err, result) {
                if (err) {
                    res.redirect('/getHospital');
                }
                else {
                    Common.redirectWithJSON(req, res, '1', 'Hospital Add Successfully');
                    res.redirect('/getHospital');
                }
            });
        }

    });
}

// TODO: delete Hospital 

function _deleteHospital(req, res, next) {
    var hospitalId = req.query.hospitalId;
    var json = {};
    var object = { isDeleted: true };
    Common.removeImageById(HOSPITAL_DETAIL, hospitalId, { hospitalImage: 1 }, 'hospitalImage', function (err, result) {
        if (err) {
            res.redirect('/getHospital');
        }
        else {
            COMMON_SERVICES.updateByQuery(HOSPITAL_DETAIL, object, hospitalId, function (err, result) {
                if (err) {
                    res.redirect('/getHospital');
                }
                else {
                    Common.redirectWithJSON(req, res, '1', 'Hospital Deleted Successfully');
                    result.result = { 'msg': 'Hospital Deleted Successfully' };
                    res.send(json);
                }
            });
        }
    }); 
}

// TODO: get Hospital Detail 

function _getHospitalById(req, res, next) {
    Common.ensureUserInSession(req, res, function (caller) {
        var hospitalId = req.query.hospitalId;
        var json = {};
        var param = { hospitalImage: 1, hospitalName: 1, hospitalCategory: 1, address: 1, landMark: 1, pinCode: 1, state: 1, country: 1, phoneNumber: 1, website: 1 };
        COMMON_SERVICES.findById(HOSPITAL_DETAIL, hospitalId, param, function (err, result) {
            if (err) {
                res.send(result);
            }
            else {
                json.hospital = result;
                res.send(json);
            }
        });
    });
}

function _editHospital(req, res) {
    Common.ensureUserInSession(req, res, function (caller) {
        var json = {};
        var image;
        var flage = false;
        var id = req.body.id;
        var img = req.body.img;
        var timestamp = new Date().getTime();
        if (req.files.image.name != "" && req.files.image.name != "undefined" && req.files.image.name != null) {
            var imagePath = req.files.image.path;
            if (img != null && img != '' && img != 'undefined') {
                image = img;
            }
            else {
                image = timestamp + '.png';
            }
            flage = true;
        }
        else {
            image = img;
        }

        HOSPITAL_SERVICES.hospitalGetModelObject(req.body.txthospitalName, image, req.body.txthospitalCategory, req.body.txtaddress, req.body.txtlandMark, req.body.txtpinCode, req.body.txtstate, req.body.txtcountry, req.body.txtphoneNumber, req.body.txtwebsite,
            function (object) {
                if (image) {
                    var newPath = comPath.PROFILE_IMAGE + image;
                    Common.imageUpload(imagePath, newPath, function (err, result) {
                        if (err) {
                            res.redirect('/getHospital');
                        } else {
                            update(object);
                        }
                    });
                } else {
                    update(object);
                }
            }
        );

        function update(object) {
            COMMON_SERVICES.updateByQuery(HOSPITAL_DETAIL, object, id, function (err, result) {
                if (err) {
                    res.redirect('/getHospital');
                }
                else {
                    Common.redirectWithJSON(req, res, '1', 'Hospital Update Successfully');
                    res.redirect('/getHospital');
                }
            });
        }

    });
}


function _addNewCategory(req, res) {
    Common.ensureUserInSession(req, res, function (caller) {
        var json = {};
        var newCategory = new HOSPITAL_CATEGORY({
            categoryName: req.body.txtcateName,
            isDeleted: false
        });
        newCategory.save(function (err, result) {
            if (err) {
                json.status = '0';
                json.result = { "msg": err };
                res.send(json);
            }
            else {
                json.status = '1';
                json.id = result._id;
                json.categoryName = result.categoryName;
                json.result = { "msg": "inserted successfully" };
                res.send(json);
            }
        });
    });
}