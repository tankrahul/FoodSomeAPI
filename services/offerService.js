exports.offerGetModelObject = _offerGetModelObject;

function _offerGetModelObject(restaurantId, title, callback) {
    var a = {
        restaurantId: restaurantId,
        title: title
    }
    callback(a);
}