var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Collection restaurant

var restaurant = new Schema({
	restaurantName: { type: String, default: null },
	mainImage: { type: String, default: null },
	offerUsed: { type: String, default: null },
	foodType: { type: String, default: null },
	IsLiquor: { type: Boolean, default: false },
	IsDine: { type: Boolean, default: true },
	IsDelivery: { type: Boolean, default: false },
	smallTagLine: { type: String, default: null },
	startTime: { type: String, default: null },
	endTime: { type: String, default: null },
	cuisine: { type: String, default: null },
	cost: { type: String, default: null },
	contactNO: { type: String, default: null },
	paymentType: { type: String, default: null },
	IsSeating: { type: Boolean, default: true },
	additional: { type: String, default: null },
	pageVisit: { type: Number, default: null },
	voteCount: { type: Number, default: null },
	address: { type: String, default: null },
	area: { type: String, default: null },
	landMark: { type: String, default: null },
	latitude: { type: String, default: null },
	longitude: { type: String, default: null },
	city: { type: String, default: null },
	state: { type: String, default: null },
	pinCode: { type: String, default: null },
	IsActive: { type: Boolean, default: true },
	DateCreated: { type: String, default: null },
	ModifiedDate: { type: String, default: null },
	IsDeleted: { type: Boolean, default: false },
}, { collection: 'restaurant' });
exports.restaurant = mongoose.model('restaurant', restaurant);

//Collection user
var users = new Schema({
	userName: { type: String, default: null },
	profileImage: { type: String, default: null },
	mobileNo: { type: Number, default: null },
	IsPremium: { type: Boolean, default: false },
	premiumStartDate: { type: Number, default: null },
	deviceId: { type: Number, default: null },
	tokenId: { type: Number, default: null },
	status: { type: String, default: null },
	IsActive: { type: Boolean, default: true },
	DateCreated: { type: String, default: null },
	ModifiedDate: { type: String, default: null },
	IsDeleted: { type: Boolean, default: false }
}, { collection: 'users' });
exports.users = mongoose.model('users', users);

//Collection offer
var offers = new Schema({
	restaurantId: { type: String, default: null },
	title: { type: String, default: null },
	usedOfferCounter: { type: Number, default: null },
	IsActive: { type: Boolean, default: true },
	DateCreated: { type: Number, default: null },
	ModifiedDate: { type: Number, default: null },
	IsDeleted: { type: Boolean, default: false }
}, { collection: 'offers' });
exports.offers = mongoose.model('offers', offers);

//Collection myWish
var mywishs = new Schema({
	restaurantId: { type: String, default: null },
	offerId: { type: String, default: null },
	restaurantName: { type: String, default: null },
	offerTitle: { type: String, default: null },
	IsActive: { type: Boolean, default: true },
	DateCreated: { type: Number, default: null },
	ModifiedDate: { type: Number, default: null },
	IsDeleted: { type: Boolean, default: false }
}, { collection: 'mywishs' });
exports.mywishs = mongoose.model('mywishs', mywishs);
