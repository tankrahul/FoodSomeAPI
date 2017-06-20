var model = require('../models/model');
var comPath = require('../common/path');
var OFFER_DETAIL = model.offers;
var Common = require('./commonroute');
var fs = require('fs');
var ObjectID = require('mongodb').ObjectID;
var OFFER_SERVICES = require('../services/offerService');
var COMMON_SERVICES = require('../services/commonService');
var constant = require('../common/constant');

/** --------------------------------------- */
exports.getOffers = _getOffers;
exports.addOffer = _addOffer;
exports.editDoctor = _editDoctor;
exports.deleteDoctor = _deleteDoctor;
exports.getOfferById = _getOfferById;

// TODO: when / called
// METHOD : GET
function _getOffers(req, res, next) {
    var json = {};
    var param = { title: 1};
    var condition = { IsDeleted: false };
    COMMON_SERVICES.findByQuery(OFFER_DETAIL, condition, param, function (err, offers) {
        if (err) {
            Common.redirectWithJSON(req, res, '0', 'err while get offer :' + JSON.stringify(err));
        }
        else {
            json.status = '1';
            json.result = { 'msg': 'offer get successfully' };
            json.offers = offers;
            console.log(JSON.stringify(offers));
            res.send(json);
        }
    });

}

// TO DO :add restaurant detail
// METHOD : POST
function _addOffer(req, res) {
    var json = {};
    console.log("req.body" + JSON.stringify(req.body));
    OFFER_SERVICES.offerGetModelObject(req.body.restaurantId,req.body.title,
        function (object) {
            console.log("object :" + JSON.stringify(object));
            save(object);
        }
    );

    function save(object) {
        var obj = new OFFER_DETAIL(object);
        COMMON_SERVICES.saveByQuery(obj, function (err, result) {
            if (err) {
                Common.redirectWithJSON(req, res, '0', 'err while offer save data :' + JSON.stringify(err));
            }
            else {
                Common.redirectWithJSON(req, res, '1', 'Offer Add Successfully');
            }
        });
    }

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

// TODO: get Resturant Detail 
function _getOfferById(req, res, next) {
    var offerId = req.query.offerId;
    var json = {};
    var param = {};
    COMMON_SERVICES.findById(OFFER_DETAIL, offerId, param, function (err, result) {
        if (err) {
            res.send("something is worng while offer fetch : " + JSON.stringify(err));
        }
        else {
            json.offer = result;
            res.send(json);
        }
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