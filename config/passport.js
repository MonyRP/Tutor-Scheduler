const LocalStrategy = require('passport-local').Strategy;
const mysql = require('mysql');
const bcrypt = require('bcryptjs');


// Connect to database
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'rooting',
    database: 'tutor_scheduler'
});

connection.connect((err) => {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log('Passport connected as id ' + connection.threadId);
});

module.exports = function (passport) {
    let isStudent = false;
    let isTutor = false;
    let isAdmin = false;

    // Student passport-local login strategy
    passport.use('student', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        (req, email, password, done) => {
            var sql = 'SELECT * FROM `students` WHERE `email`= ?';

            connection.query(sql, [email], (error, results, fields) => {

                if (error) {
                    return done(error);
                }

                if (!results.length) {
                    return done(null, false, req.flash('loginMessage', 'No user found.'));
                }

                // Compare hashed password from database to see if it correct for user
                bcrypt.compare(password, results[0].password, (err, isMatch) => {
                    if (err) {
                        throw err;
                    }

                    if (isMatch) {
                        isStudent = true;
                        isTutor = false;
                        isAdmin = false;
                        return done(null, results[0]);
                    }
                    return done(null, false, req.flash('loginMessage', 'Wrong password.'));
                })
            });
        }));

    // Tutor passport-local login strategy
    passport.use('tutor', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        (req, email, password, done) => {
            var sql = 'SELECT * FROM `tutors` WHERE `email`= ?';

            connection.query(sql, [email], (error, results, fields) => {

                if (error) {
                    return done(error);
                }

                if (!results.length) {
                    return done(null, false, req.flash('loginMessage', 'No user found.'));
                }

                // Compare hashed password from database to see if it correct for user
                bcrypt.compare(password, results[0].password, (err, isMatch) => {
                    if (err) {
                        throw err;
                    }

                    if (isMatch) {
                        isStudent = false;
                        isTutor = true;
                        isAdmin = false;
                        return done(null, results[0]);
                    }
                    return done(null, false, req.flash('loginMessage', 'Wrong password.'));
                })
            });

        }));

    // Admin passport-local login strategy
    passport.use('admin', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        (req, email, password, done) => {
            var sql = 'SELECT * FROM `admin` WHERE `email`= ?';

            connection.query(sql, [email], (error, results, fields) => {

                if (error) {
                    return done(error);
                }

                if (!results.length) {
                    return done(null, false, req.flash('loginMessage', 'No user found.'));
                }

                // Compare hashed password from database to see if it correct for user
                bcrypt.compare(password, results[0].password, (err, isMatch) => {
                    if (err) {
                        throw err;
                    }

                    if (isMatch) {
                        isStudent = false;
                        isTutor = false;
                        isAdmin = true;
                        return done(null, results[0]);
                    }
                    return done(null, false, req.flash('loginMessage', 'Wrong password.'));
                })
            });
        }));


    passport.serializeUser(function (user, done) {
        done(null, user.banner_id);
    });

    passport.deserializeUser(function (id, done) {
        let sql;

        if (isStudent) {
            sql = 'SELECT * FROM `students` WHERE `banner_id`= ?';
        } else if (isTutor) {
            sql = 'SELECT * FROM `tutors` WHERE `banner_id`= ?';
        } else {
            sql = 'SELECT * FROM `admin` WHERE `banner_id`= ?';
        }

        connection.query(sql, [id], (error, results, fields) => {

            done(error, {
                banner_id: results[0].banner_id,
                first_name: results[0].first_name,
                last_name: results[0].last_name,
                email: results[0].email,
                description: results[0].description,
                isStudent: isStudent,
                isTutor: isTutor,
                isAdmin: isAdmin
            });
        });
    });
}

// Function to log query results
function logResults(results) {
    console.log(results);
}