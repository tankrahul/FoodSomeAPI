var model = require('../models/model');
var ADMIN_CREDENTIAL = model.adminCredential;
var Common = require('./commonroute');

/** --------------------------------------- */
exports.index = _index;
exports.login = _login;
exports.Logout = _logout;
exports.userlogin = _userlogin;


// TODO: when / called
function _index(req, res, next) {
	Common.ensureUserInSession(req, res, function (caller) {
		console.log('caller' + JSON.stringify(caller));
		res.render('index', {
			path: req.path,
			caller: caller
		});
	});
}

/*
TODO: GET To Show Login Page
*/

function _login(req, res, next) {
	if (req.session.user == 'undefined' && req.session.user && req.session.user != null) {
		res.redirect('/getDoctor');
	}
	else {
		res.render('login', {
			path: req.path,
			caller: {}
		});
	}
}

/*
TODO: GET To Show Logout Page
*/

function _logout(req, res, next) {
	req.session.destroy(function (e) {
		res.redirect('/login');
	});
}


// TODO: user login

function _userlogin(req, res, next) {
	var json = {};
	var email = req.body.email;
	var password = req.body.password;
	console.log('console credencial :' + email + 'Password :' + password);
	ADMIN_CREDENTIAL.findOne({ isDeleted: false, userName: email, password: password }, function (err, user) { 
		var json = {};
		if (!user) {
			json.status = '0';
			json.result = { 'fail': 'Dam Email Address or Password Wrong !!!' };
			res.send(json);
		} else {
			json.status = '1';
			json.result = { 'success': 'Login Successfully', 'status': 200 };
			req.session.user = user;
			res.send(json);
		}
	});
}
