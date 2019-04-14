const bcrypt = require('bcryptjs');
const faker = require('faker');

// Generates random student. Password and email domain opional.
// Used to populate student database tables
var generateRandomStudent = function (password, domainName) {
    let bannerId = Math.floor(Math.random() * (99999 - 10000 + 1) + 10000);
    let firstName = faker.name.firstName();
    let lastName = faker.name.lastName();
    let email = faker.internet.email(firstName, lastName, domainName || "nnmc.edu");

    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(password || (firstName + lastName), salt);

    return {
        banner_id: bannerId,
        first_name: firstName,
        last_name: lastName,
        email: email,
        password: hash
    }
}

// Generates student with specified values.
// If no password specified, then password = [firstName + lastName]@nnmc.edu.
// Used to populate student database tables.
var generateStudent = function (bannerId, firstName, lastName, email, password) {
    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(password || (firstName + lastName), salt);

    return {
        banner_id: bannerId,
        first_name: firstName,
        last_name: lastName,
        email: email,
        password: hash
    }
}

// Generates random tutor. Password and email domain opional.
// Used to populate tutor database tables.
var generateRandomTutor = function (password, domainName) {
    let bannerId = Math.floor(Math.random() * (99999 - 10000 + 1) + 10000);
    let firstName = faker.name.firstName();
    let lastName = faker.name.lastName();
    let email = faker.internet.email(firstName, lastName, domainName || "nnmc.edu");
    let math = Math.random() >= 0.5;
    let science = Math.random() >= 0.5;
    let english = Math.random() >= 0.5;
    let history = Math.random() >= 0.5;
    let engineering = Math.random() >= 0.5;
    let business = Math.random() >= 0.5;

    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(password || (firstName + lastName), salt);

    return {
        banner_id: bannerId,
        first_name: firstName,
        last_name: lastName,
        email: email,
        password: hash,
        math: math,
        science: science,
        english: english,
        history: history,
        engineering: engineering,
        business: business
    }
}

// Generates tutor with specified values.
// If no password specified, then password = [firstName + lastName]@nnmc.edu.
// Used to populate tutor database tables.
var generateTutor = function (bannerId, firstName, lastName, email, password,
    math, science, english, history, engineering, business) {

    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(password || (firstName + lastName), salt);

    return {
        banner_id: bannerId,
        first_name: firstName,
        last_name: lastName,
        email: email,
        password: hash,
        math: math,
        science: science,
        english: english,
        history: history,
        engineering: engineering,
        business: business
    }
}

// Generates admin with specified values. 
// If no password specified, then password = [firstName + lastName]@nnmc.edu.
// Used to populate admin database tables.
var generateAdmin = function (bannerId, firstName, lastName, email, password) {

    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(password || (firstName + lastName), salt);

    return {
        banner_id: bannerId,
        first_name: firstName,
        last_name: lastName,
        email: email,
        password: hash
    }
}

module.exports = {
    generateStudent,
    generateRandomStudent,
    generateTutor,
    generateRandomTutor,
    generateAdmin
}