exports.pharmacieGetModelObject = _pharmacieGetModelObject;

function _pharmacieGetModelObject(pharmacieName, pharmacieImage, pharmacieCategory, address, landMark, pinCode, state, country, phoneNumber, website, callback) {
    var a = {
        pharmacieName: pharmacieName,
        pharmacieImage: pharmacieImage,
        pharmacieCategory: pharmacieCategory,
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