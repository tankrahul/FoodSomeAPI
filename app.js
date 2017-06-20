var express = require('express');
var fs = require('fs');
var http = require('http');
var path = require('path');
var util = require('util'); // mathematical operation karva hoy to aeno use thai
var bodyParser = require('body-parser');
// var jsonParser = bodyParser.json();
var methodOverride = require('method-override');
var mongoose = require('mongoose');
var app = express();
var routes = require('./routes');
var session = require('client-sessions');
var static = require('serve-static');
var database = require('./config/database'); 	// Get configuration file 
mongoose.Promise = require('bluebird');
var multipart = require('connect-multiparty');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');

mongoose.connect(database.url);
var db = mongoose.connection;
app.set('port', process.env.PORT || 8001);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.logger('dev'));
app.use(multipart());
app.use(express.urlencoded());
app.use(bodyParser.json());
app.use(methodOverride());
app.use(cookieParser());
app.use(cookieSession({secret: 'app_1'}));

/*---------------------------------------------------------------------*/
var indexroute = require('./routes/index');
var doctorroute = require('./routes/doctorroute');
var hospitalroute = require('./routes/hospitalroute');
var pharmacieroute = require('./routes/pharmacieroute');
var restaurantsroute = require('./routes/restaurantsroute');
var offerroute = require('./routes/offerroute');
var mywishroute = require('./routes/mywishroute');



/*-------------------index------------------------------*/
app.get('/', indexroute.index); //this will show indexpage
/*-------------------login------------------------------*/
app.get('/login', indexroute.login);
app.get('/Logout', indexroute.Logout);
app.post('/userlogin', indexroute.userlogin);

/*-------------------Doctor Module------------------------------*/
app.get('/getDoctor', doctorroute.getDoctor);
app.get('/deleteDoctor', doctorroute.deleteDoctor);
app.get('/getDoctorById', doctorroute.getDoctorById);
app.post('/addDoctor', doctorroute.addDoctor);
app.post('/editDoctor', doctorroute.editDoctor);

/*-------------------Hospital Module------------------------------*/
app.get('/getHospital', hospitalroute.getHospital);
app.get('/deleteHospital', hospitalroute.deleteHospital);
app.get('/getHospitalById', hospitalroute.getHospitalById);
app.post('/addHospital', hospitalroute.addHospital);
app.post('/editHospital', hospitalroute.editHospital);
app.post('/addNewCategory', hospitalroute.addNewCategory);

/*-------------------Pharmacies Module------------------------------*/
app.get('/getPharmacie', pharmacieroute.getPharmacie);
app.get('/deletePharmacie', pharmacieroute.deletePharmacie);
app.get('/getPharmacieById', pharmacieroute.getPharmacieById);
app.post('/addPharmacie', pharmacieroute.addPharmacie);
app.post('/editPharmacie', pharmacieroute.editPharmacie);
app.post('/addPharmacieCategory', pharmacieroute.addPharmacieCategory);

/*-------------------Restaurants Module------------------------------*/
app.get('/getRestaurants', restaurantsroute.getRestaurants);
app.get('/deletePharmacie', pharmacieroute.deletePharmacie);
app.get('/getRestaurantById', restaurantsroute.getRestaurantById);
app.post('/addRestaurant', restaurantsroute.addRestaurant);
app.post('/editPharmacie', pharmacieroute.editPharmacie);

/*-------------------Offer Module------------------------------*/
app.get('/getOffers', offerroute.getOffers);
app.get('/deletePharmacie', pharmacieroute.deletePharmacie);
app.get('/getOfferById', offerroute.getOfferById);
app.post('/addOffer', offerroute.addOffer);
app.post('/editPharmacie', pharmacieroute.editPharmacie);

/*-------------------Mywish Module------------------------------*/
app.get('/getMywishs', mywishroute.getMywishs);
app.post('/deleteMywish', mywishroute.deleteMywish);
app.post('/addMywish', mywishroute.addMywish);




//It Will Start Server on PORT-7070
http.createServer(app).listen(app.get('port'), function () {
	console.log('Express server listening on port ' + app.get('port'));
});