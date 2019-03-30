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

    passport.use(new LocalStrategy({
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
                        return done(null, results[0]);
                    }
                    return done(null, false, req.flash('loginMessage', 'Wrong password.'));

                })
            });



        }));


    passport.serializeUser(function (user, done) {
        logResults("User from serializeUser function callback: " + JSON.stringify(user));
        done(null, user.banner_id);
    });

    passport.deserializeUser(function (id, done) {
        logResults("ID from deserializeUser callback: " + id);

        var sql = 'SELECT * FROM `students` WHERE `banner_id`= ?';

        connection.query(sql, [id], (error, results, fields) => {
            done(error, results[0]);
        });
    });
}

// Function to log query results
function logResults(results) {
    console.log(results);
}