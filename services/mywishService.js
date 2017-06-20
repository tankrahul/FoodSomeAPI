exports.mywishGetModelObject = _mywishGetModelObject;

function _mywishGetModelObject(restaurantId, restaurantName,offerTitle,offerId, callback) {
    var a = {
        restaurantId: restaurantId,
        restaurantName: restaurantName,
        offerTitle: offerTitle,
        offerId: offerId
    }
    callback(a);
}