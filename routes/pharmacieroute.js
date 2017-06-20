var model = require('../models/model');
var comPath = require('../common/path');
var constant = require('../common/constant');

var Common = require('./commonroute');
var COMMON_SERVICES = require('../services/commonService');
var PHARMACIE_SERVICES = require('../services/pharmacieService');
var PHARMACIE_DETAIL = model.pharmacieDetail;
var PHARMACIE_CATEGORY = model.pharmacieCategory;
var fs = require('fs');
var ObjectID = require('mongodb').ObjectID;

/** --------------------------------------- */
exports.getPharmacie = _getPharmacie;
exports.addPharmacie = _addPharmacie;
exports.editPharmacie = _editPharmacie;
exports.deletePharmacie = _deletePharmacie;
exports.getPharmacieById = _getPharmacieById;
exports.addPharmacieCategory = _addPharmacieCategory;

// TODO: when / called
function _getPharmacie(req, res, next) {

    Common.ensureUserInSession(req, res, function (caller) {

        var param = { pharmacieImage: 1, pharmacieName: 1, phoneNumber: 1, website: 1, pharmacieCategory: 1 };
        var condition = { isDeleted: false };
        var alert;

        COMMON_SERVICES.findByQuery(PHARMACIE_DETAIL, condition, param, function (err, pharmacies) {
            if (err) {
                res.render(constant.PHARMACIE_TYPE, {
                    path: req.path,
                    caller: caller,
                    pharmacies: pharmacies,
                    alert: err
                });
            }
            else {
                if (req.session.flage) {
                    req.session.flage = false;
                    alert = req.session.json;
                    req.session.json = null;
                }
                var pharmacies = pharmacies;
                param = { categoryName: 1 };
                COMMON_SERVICES.findByQuery(PHARMACIE_CATEGORY, condition, param, function (err, categorys) {
                    if (err) {
                        res.render(constant.PHARMACIE_TYPE, {
                            path: req.path,
                            caller: caller,
                            pharmacies: categorys,
                            alert: err
                        });
                    }
                    else {
                        res.render(constant.PHARMACIE_TYPE, {
                            path: req.path,
                            caller: caller,
                            pharmacies: pharmacies,
                            categorys: categorys,
                            alert: alert
                        });
                    }
                });
            }
        });
    });
}

// TO DO :add pharmacie detail

function _addPharmacie(req, res) {
    Common.ensureUserInSession(req, res, function (caller) {
        var json = {};
        var image;
        var timestamp = new Date().getTime();
        if (req.files.image.name != "" && req.files.image.name != "undefined" && req.files.image.name != null) {
            var imagePath = req.files.image.path;
            image = timestamp + '.png';
        }

        PHARMACIE_SERVICES.pharmacieGetModelObject(req.body.txtpharmacieName, image, req.body.txtpharmacieCategory, req.body.txtaddress, req.body.txtlandMark, req.body.txtpinCode, req.body.txtstate, req.body.txtcountry, req.body.txtphoneNumber, req.body.txtwebsite,
            function (object) {
                if (image) {
                    var newPath = comPath.PROFILE_IMAGE + image;
                    Common.imageUpload(imagePath, newPath, function (err, result) {
                        if (err) {
                            res.redirect('/getPharmacie');
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
            var obj = new PHARMACIE_DETAIL(object);
            COMMON_SERVICES.saveByQuery(obj, function (err, result) {
                if (err) {
                    res.redirect('/getPharmacie');
                }
                else {
                    Common.redirectWithJSON(req, res, '1', 'Pharmacie Add Successfully');
                    res.redirect('/getPharmacie');
                }
            });
        }

    });
}

// TODO: delete Pharmacie 

function _deletePharmacie(req, res, next) {
    Common.ensureUserInSession(req, res, function (caller) {
        var pharmacieId = req.query.pharmacieId;
        var json = {};
        var object = { isDeleted: true };
        Common.removeImageById(PHARMACIE_DETAIL, pharmacieId, { pharmacieImage: 1 }, 'pharmacieImage', function (err, result) {
            if (err) {
                res.redirect('/getPharmacie');
            }
            else {
                COMMON_SERVICES.updateByQuery(PHARMACIE_DETAIL, object, pharmacieId, function (err, result) {
                    if (err) {
                        res.redirect('/getPharmacie');
                    }
                    else {
                        Common.redirectWithJSON(req, res, '1', 'Pharmacie Deleted Successfully');
                        result.result = { 'msg': 'Pharmacie Deleted Successfully' };
                        res.send(json);
                    }
                });
            }
        });
    });
}

// TODO: get Pharmacie Detail 

function _getPharmacieById(req, res, next) {
    Common.ensureUserInSession(req, res, function (caller) {
        var pharmacieId = req.query.pharmacieId;
        var json = {};
        var param = { pharmacieImage: 1, pharmacieName: 1, pharmacieCategory: 1, address: 1, landMark: 1, pinCode: 1, state: 1, country: 1, phoneNumber: 1, website: 1 };
        COMMON_SERVICES.findById(PHARMACIE_DETAIL, pharmacieId, param, function (err, result) {
            if (err) {
                res.send(result);
            }
            else {
                json.pharmacie = result;
                res.send(json);
            }
        });
    });
}

function _editPharmacie(req, res) {
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

        PHARMACIE_SERVICES.pharmacieGetModelObject(req.body.txtpharmacieName, image, req.body.txtpharmacieCategory, req.body.txtaddress, req.body.txtlandMark, req.body.txtpinCode, req.body.txtstate, req.body.txtcountry, req.body.txtphoneNumber, req.body.txtwebsite,
            function (object) {
                if (image) {
                    var newPath = comPath.PROFILE_IMAGE + image;
                    Common.imageUpload(imagePath, newPath, function (err, result) {
                        if (err) {
                            res.redirect('/getPharmacie');
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
            COMMON_SERVICES.updateByQuery(PHARMACIE_DETAIL, object, id, function (err, result) {
                if (err) {
                    res.redirect('/getPharmacie');
                }
                else {
                    Common.redirectWithJSON(req, res, '1', 'Pharmacie Update Successfully');
                    res.redirect('/getPharmacie');
                }
            });
        }

    });
}


function _addPharmacieCategory(req, res) {
    Common.ensureUserInSession(req, res, function (caller) {
        var json = {};
        var newCategory = new PHARMACIE_CATEGORY({
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