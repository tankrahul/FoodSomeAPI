exports.hospitalGetModelObject = _hospitalGetModelObject;

function _hospitalGetModelObject(hospitalName, hospitalImage, hospitalCategory, address, landMark, pinCode, state, country, phoneNumber, website, callback) {
    var a = {
        hospitalName: hospitalName,
        hospitalImage: hospitalImage,
        hospitalCategory: hospitalCategory,
        address: address,
        landMark: landMark,
        pinCode: pinCode,
        state: state,
        country: country,
        phoneNumber: phoneNumber,
        website: website,
        addDate: null,
        editDate: null,
        isDeleted: false
    }
    callback(a);
}