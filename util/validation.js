function isEmpty(value) {
    return !value || !value.trim() === "";
}

function userCredentialsAreValid(email, password, phone, postal) {
    return (
        email &&
        email.includes("@") &&
        password &&
        password.trim().length >= 6 &&
        phone &&
        phone.trim().length === 10 &&
        postal &&
        postal.trim().length <= 6
    );
}

function userDetailsAreValid(
    firstName,
    lastName,
    email,
    phoneNumber,
    password,
    street,
    city,
    country,
    postal
) {
    return (
        userCredentialsAreValid(email, password, phoneNumber, postal) &&
        !isEmpty(firstName) &&
        !isEmpty(lastName) &&
        !isEmpty(street) &&
        !isEmpty(city) &&
        !isEmpty(country)
    );
}

function passwordIsConfirmed(password, confirmPassword) {
    return password === confirmPassword;
}

module.exports = { isEmpty, userDetailsAreValid, passwordIsConfirmed };
