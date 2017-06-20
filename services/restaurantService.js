exports.restaurantGetModelObject = _restaurantGetModelObject;

function _restaurantGetModelObject(restaurantName, mainImage, foodType, IsLiquor, IsDine, IsDelivery, smallTagLine, startTime, endTime, cuisine,cost,contactNO,paymentType,IsSeating,additional,address,area,landMark,latitude,longitude,city,state,pinCode, callback) {
    var a = {
        restaurantName: restaurantName,
        mainImage: mainImage,
        foodType: foodType,
        IsLiquor: IsLiquor,
        IsDine: IsDine,
        IsDelivery: IsDelivery,
        smallTagLine: smallTagLine,
        startTime: startTime,
        endTime: endTime,
        cuisine: cuisine,
        cost: cost,
        contactNO: contactNO,
        paymentType: paymentType,
        IsSeating: IsSeating,
        additional: additional,
        address: address,
        area: area,
        landMark: landMark,
        latitude: latitude,
        longitude: longitude,
        city: city,
        state: state,
        pinCode: pinCode
    }
    callback(a);
}