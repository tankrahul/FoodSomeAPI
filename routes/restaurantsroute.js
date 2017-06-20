var model = require('../models/model');
var comPath = require('../common/path');
var RESTAURANT_DETAIL = model.restaurant;
var Common = require('./commonroute');
var fs = require('fs');
var ObjectID = require('mongodb').ObjectID;
var RESTAURANT_SERVICES = require('../services/restaurantService');
var COMMON_SERVICES = require('../services/commonService');
var constant = require('../common/constant');

/** --------------------------------------- */
exports.getRestaurants = _getRestaurants;
exports.addRestaurant = _addRestaurant;
exports.editDoctor = _editDoctor;
exports.deleteDoctor = _deleteDoctor;
exports.getRestaurantById = _getResturantById;

// TODO: when / called
// METHOD : GET
function _getRestaurants(req, res, next) {
    var json = {};
    var param = { restaurantName: 1, mainImage: 1, offerUsed: 1 };
    var condition = { IsDeleted: false };
    var alert;
    COMMON_SERVICES.findByQuery(RESTAURANT_DETAIL, condition, param, function (err, restaurants) {
        if (err) {
            Common.redirectWithJSON(req, res, '0', 'err while get restaurant :' + JSON.stringify(err));
        }
        else {
            json.status = '1';
            json.result = { 'msg': 'restaurant get successfully' };
            json.restaurants = restaurants;
            console.log(JSON.stringify(restaurants));
            res.send(json);
        }
    });

}

// TO DO :add restaurant detail
// METHOD : POST
function _addRestaurant(req, res) {
    var json = {};
    var image;
    var timestamp = new Date().getTime();

    if (req.files.image.name != "" && req.files.image.name != "undefined" && req.files.image.name != null) {
        var imagePath = req.files.image.path;
        image = timestamp + '.png';
    }
    console.log("req.body" + JSON.stringify(req.body));
    console.log("req.files.image" + JSON.stringify(req.files.image.name));
    RESTAURANT_SERVICES.restaurantGetModelObject(req.body.restaurantName, image, req.body.foodType, req.body.IsLiquor, req.body.IsDine, req.body.IsDelivery, req.body.smallTagLine, req.body.startTime, req.body.endTime, req.body.cuisine, req.body.cost, req.body.contactNO, req.body.paymentType, req.body.IsSeating, req.body.additional, req.body.address, req.body.area, req.body.landMark, req.body.latitude, req.body.longitude, req.body.city, req.body.state, req.body.pinCode,
        function (object) {
            console.log("object :" + JSON.stringify(object));
            if (image) {
                var newPath = comPath.PROFILE_IMAGE + image;
                Common.imageUpload(imagePath, newPath, function (err, result) {
                    if (err) {
                        json.status = '0';
                        json.result = { 'msg': 'err while image uploading' };
                        res.send(json);
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
        var obj = new RESTAURANT_DETAIL(object);
        COMMON_SERVICES.saveByQuery(obj, function (err, result) {
            if (err) {
                Common.redirectWithJSON(req, res, '0', 'err while save data :' + JSON.stringify(err));
            }
            else {
                Common.redirectWithJSON(req, res, '1', 'Restaurant Add Successfully');
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
function _getResturantById(req, res, next) {
        var resturantId = req.query.resturantId;
        var json = {};
        var param = { };
        COMMON_SERVICES.findById(RESTAURANT_DETAIL, resturantId, param, function (err, result) {
            if (err) {
                res.send("something is worng : "+JSON.stringify(err));
            }
            else {
                json.restaurant = result;
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