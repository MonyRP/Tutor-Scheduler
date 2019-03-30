const bcrypt = require('bcryptjs');
const passport = require('passport');
const mysql = require('mysql');
const faker = require('faker');

// Generates random student or tutor. Used to populate student and/or tutor database tables
var generateUser = function (password, domainName) {
    var bannerId;
    var firstName;
    var lastName;
    var email;
    var salt;
    var hash;

    bannerId = Math.floor(Math.random() * (99999 - 10000 + 1) + 10000);
    firstName = faker.name.firstName();
    lastName = faker.name.lastName();
    email = faker.internet.email(firstName, lastName, domainName || "nnmc.edu");

    salt = bcrypt.genSaltSync(10);
    hash = bcrypt.hashSync(password || (firstName + lastName), salt);

    console.log("Password match: " + bcrypt.compareSync((firstName + lastName), hash));

    return {
        banner_id: bannerId,
        first_name: firstName,
        last_name: lastName,
        email: email,
        password: hash
    }

}

module.exports = {
    generateUser
}