var model = require('../models/model');
var USER_COLLECTION = model.users;
var ObjectID = require('mongodb').ObjectID;

/*-------------------------------------------------------*/
exports.loginUser = _loginUser;
exports.userRegistaration = _userRegistaration;
exports.userDetail = _userDetail;

/*
TODO:To Get Users.
*/

function _loginUser(req, res, next) {
	var json = {};
	var deviceId = req.body.deviceId;
	// for form login
	if (deviceId == "" || deviceId == 'undefined' || deviceId == null) {
		json.status = '0';
		json.result = { 'msg': 'Device Id Missing' };
		res.send(json);
	}
	else {
		USER_COLLECTION.find({ deviceId: deviceId }, function (error, user) {
			if (error) {
				json.status = '0';
				json.result = { 'msg': 'Error in Retreving User' };
				res.send(json);
			} else {
				console.log('user :' + user);
				if (user == null || user.length <= 0 || user == "") {
					json.status = '0';
					json.result = { 'msg': 'User not Found' };
					res.send(json);
				}
				else {
					json.status = '1';
					json.userId = user._id;
					json.userName = user.userName;
					json.profileImage = user.profileImage;
					json.result = { 'msg': 'Login Successfully' };
					res.send(json);
				}
			}
		});
	}
}


// TODO: new user Registration 

function _userRegistaration(req, res, next) {
	var json = {};
	var userName = req.body.userName;
	var mobileNo = req.body.mobileNo;
	var deviceId = req.body.deviceId;
	var tokenId = req.body.tokenId;
	if (userName == "" || userName == 'undefined' || userName == null) {
		json.status = '0';
		json.result = { 'msg': 'userName Missing' };
		res.send(json);
	}
	else if (mobileNo == "" || mobileNo == 'undefined' || mobileNo == null) {
		json.status = '0';
		json.result = { 'msg': 'mobile Number Missing' };
		res.send(json);
	}
	else if (deviceId == "" || deviceId == 'undefined' || deviceId == null) {
		json.status = '0';
		json.result = { 'msg': 'Device Id Missing' };
		res.send(json);
	}
	else if (tokenId == "" || tokenId == 'undefined' || tokenId == null) {
		json.status = '0';
		json.result = { 'msg': 'Token Id Missing' };
		res.send(json);
	}
	else {
		USER_COLLECTION.findOne({ mobileNo: mobileNo }, function (err, user) {
			console.log("user : " + user);
			if (user != null) {
				json.status = '2';
				json.result = { 'msg': 'Mobile Number is used' };
				res.send(json); 
			}
			else {
				var userDetail = new USER_COLLECTION({
					userName: userName,
					mobileNo: mobileNo,
					is_deleted: false
				});
				userDetail.save(function (err, user) {
					if (err) {
						json.status = '0';
						json.result = { 'msg': 'Error in Inserting User' };
						res.send(json);
					}
					else {
						USER_COLLECTION.findOne({ mobileNo: mobileNo, email: email }, function (err, newUser) {
							json.status = '1',
							json.userId = newUser._id;
							json.userName = userName;
							json.result = { 'msg': 'New user added successfully' };
							res.send(json);
						});
					}
				});
			}
		});
	}
}

// TODO : get user userDetail

function _userDetail(req, res, next) {
	var json = {};
	var userId = req.query.userId;

	if (userId == "" || userId == 'undefined' || userId == null) {
		json.status = '0';
		json.result = { 'msg': 'userId Missing' };
		res.send(json);
	}
	else {
		USER_COLLECTION.findOne({ _id: new ObjectID(userId) }, function (err, user) {
			if (err) {
				json.status = '0';
				json.result = { 'msg': 'User not Found' };
				res.send(json);
			}
			else {
				json.status = '1';
				json.userDetil = { 'emailId': user.email, 'mobileNo': user.mobileNo, 'interest': user.interest },
				json.result = { 'msg': 'user successfully found' };
				res.send(json);
			}
		});
	}
}