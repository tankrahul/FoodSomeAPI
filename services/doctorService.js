exports.doctorGetModelObject = _doctorGetModelObject;

function _doctorGetModelObject(doctorName, image, doctorSpecialty, address, landMark, pinCode, state, country, openingDays, openingTime,endTime,phoneNumber,faxNumber,email,website,consultationFee,homeVisit, callback) {
    var a = {
        doctorName: doctorName,
        doctorImage: image,
        doctorSpecialty: doctorSpecialty,
        address: address,
        landMark: landMark,
        pinCode: pinCode,
        state: state,
        country: country,
        openingDays: openingDays,
        openingTime: openingTime,
        endTime: endTime,
        phoneNumber: phoneNumber,
        faxNumber: faxNumber,
        email: email,
        website: website,
        consultationFee: consultationFee,
        homeVisit: homeVisit,
        addDate: null,
        editDate: null,
        isDeleted: false
    }
    callback(a);
}