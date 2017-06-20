var model = require('../models/model');
var comPath = require('../common/path');
var DOCTOR_DETAIL = model.doctorDetail;
var Common = require('./commonroute');
var fs = require('fs');
var ObjectID = require('mongodb').ObjectID;
var DOCTOR_SERVICES = require('../services/doctorService');
var COMMON_SERVICES = require('../services/commonService');
var constant = require('../common/constant');

/** --------------------------------------- */
exports.getDoctor = _getDoctor;
exports.addDoctor = _addDoctor;
exports.editDoctor = _editDoctor;
exports.deleteDoctor = _deleteDoctor;
exports.getDoctorById = _getDoctorById;

// TODO: when / called
// METHOD : GET
function _getDoctor(req, res, next) {
    Common.ensureUserInSession(req, res, function (caller) {
        var param = { doctorImage: 1, doctorName: 1, doctorSpecialty: 1, phoneNumber: 1, consultationFee: 1 };
        var condition = { isDeleted: false };
        var alert;

        COMMON_SERVICES.findByQuery(DOCTOR_DETAIL, condition, param, function (err, doctors) {
            if (err) {
                res.render(constant.DOCTOR_TYPE, {
                    path: req.path,
                    caller: caller,
                    doctors: doctors,
                    alert: err
                });
            }
            else {
                if (req.session.flage) {
                    req.session.flage = false;
                    alert = req.session.json;
                    req.session.json = null;
                }
                res.render(constant.DOCTOR_TYPE, {
                    path: req.path,
                    caller: caller,
                    doctors: doctors,
                    alert: alert
                });
            }
        });

    });
}

// TO DO :add doctor detail
// METHOD : POST
function _addDoctor(req, res) {
    Common.ensureUserInSession(req, res, function (caller) {
        var json = {};
        var image;
        var timestamp = new Date().getTime();
        if (req.files.image.name != "" && req.files.image.name != "undefined" && req.files.image.name != null) {
            var imagePath = req.files.image.path;
            image = timestamp + '.png';
        }

        DOCTOR_SERVICES.doctorGetModelObject(req.body.txtdoctorName, image, req.body.txtdoctorSpecialty, req.body.txtaddress, req.body.txtlandMark, req.body.txtpinCode, req.body.txtstate, req.body.txtcountry, req.body.drpopeningDays, req.body.starttime, req.body.endtime, req.body.txtphoneNumber, req.body.txtfaxNumber, req.body.txtemail, req.body.txtwebsite, req.body.txtconsultationFee, req.body.rdohomeVisit,
            function (object) {
                if (image) {
                    var newPath = comPath.PROFILE_IMAGE + image;
                    Common.imageUpload(imagePath, newPath, function (err, result) {
                        if (err) {
                            res.redirect('/getDoctor');
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
            var obj = new DOCTOR_DETAIL(object);
            COMMON_SERVICES.saveByQuery(obj, function (err, result) {
                if (err) {
                    res.redirect('/getDoctor');
                }
                else {
                    Common.redirectWithJSON(req, res, '1', 'Doctor Add Successfully');
                    res.redirect('/getDoctor');
                }
            });
        }

    });
}



// TODO: delete Doctor 
// METHOD : POST
function _deleteDoctor(req, res, next) {

    Common.ensureUserInSession(req, res, function (caller) {
        var doctorId = req.query.doctorId;
        var json = {};
        var object = { isDeleted: true };
        Common.removeImageById(DOCTOR_DETAIL, doctorId, { doctorImage: 1 }, 'doctorImage', function (err, result) {
            if (err) {
                res.redirect('/getDoctor');
            }
            else {
                COMMON_SERVICES.updateByQuery(DOCTOR_DETAIL, object, doctorId, function (err, result) {
                    if (err) {
                        res.send(result);
                    }
                    else {
                        Common.redirectWithJSON(req, res, '1', 'Doctor Deleted Successfully');
                        result.result = { 'msg': 'Doctor Deleted Successfully' };
                        res.send(result);
                    }
                });
            }
        });
    });
}

// TODO: get Doctor Detail 
function _getDoctorById(req, res, next) {
    Common.ensureUserInSession(req, res, function (caller) {
        var doctorId = req.query.doctorId;
        var json = {};
        var param = { doctorName: 1, doctorImage: 1, doctorSpecialty: 1, address: 1, landMark: 1, pinCode: 1, state: 1, country: 1, openingDays: 1, openingTime: 1, endTime: 1, phoneNumber: 1, faxNumber: 1, email: 1, website: 1, consultationFee: 1, homeVisit: 1 };
        COMMON_SERVICES.findById(DOCTOR_DETAIL, doctorId, param, function (err, result) {
            if (err) {
                res.send(result);
            }
            else {
                json.doctor = result;
                res.send(json);
            }
        });

    });
}

function _editDoctor(req, res) {
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

        DOCTOR_SERVICES.doctorGetModelObject(req.body.txtdoctorName, image, req.body.txtdoctorSpecialty, req.body.txtaddress, req.body.txtlandMark, req.body.txtpinCode, req.body.txtstate, req.body.txtcountry, req.body.drpopeningDays, req.body.starttime, req.body.endtime, req.body.txtphoneNumber, req.body.txtfaxNumber, req.body.txtemail, req.body.txtwebsite, req.body.txtconsultationFee, req.body.rdohomeVisit,
            function (object) {
                if (flage) {
                    var newPath = comPath.PROFILE_IMAGE + image;
                    Common.imageUpload(imagePath, newPath, function (err, result) {
                        if (err) {
                            res.redirect('/getDoctor');
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
            COMMON_SERVICES.updateByQuery(DOCTOR_DETAIL, object, id, function (err, result) {
                if (err) {
                    res.redirect('/getDoctor');
                }
                else {
                    Common.redirectWithJSON(req, res, '1', 'Hospital Update Successfully');
                    res.redirect('/getDoctor');
                }
            });
        }
    });
}