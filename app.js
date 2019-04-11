const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const mysql = require('mysql');
const faker = require('faker');
const {
    ensureAuthenticated,
    ensureStudent,
    ensureTutor,
    ensureAdmin
} = require('./helpers/auth');

const app = express();

// Load routes
const users = require('./routes/users');

// Get createUsers methods
const createUser = require('./config/database/createUser');

// Passport Config
require('./config/passport')(passport);

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
    console.log('connected as id ' + connection.threadId);
});

// Middleware for static files
app.use('/public', express.static(__dirname + '/public'));

// Handlebars middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));

app.set('view engine', 'handlebars');

// Body Parser middleware
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

// Method override middleware is used to update and delete
app.use(methodOverride('_method'));

// Express session midleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// connect-flash middleware
app.use(flash());

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Global variables
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.loginMessage = req.flash('loginMessage');
    res.locals.user = req.user || null;
    next();
});

// Home Route
app.get('/', ensureStudent, (req, res) => {

    var sql = 'SELECT sum(math) AS math_count, sum(science) AS science_count,' +
        'sum(engineering) AS engineering_count, sum(business) AS business_count FROM `tutors`';

    connection.query(sql, (error, results, fields) => {
        res.render('index', {
            mathCount: results[0].math_count,
            scienceCount: results[0].science_count,
            engineeringCount: results[0].engineering_count,
            businessCount: results[0].business_count,
        });
    })
});

// Display tutors route
app.get('/display-tutors', ensureStudent, (req, res) => {
    let subject = req.query.subject;

    var sql = `SELECT * FROM tutors WHERE ${subject} = 1 ORDER BY first_name ASC`;

    connection.query(sql, (error, results, fields) => {
        res.send(results);
    })
});

// Scheduled session route
app.get('/schedule-session/:banner_id', ensureAuthenticated, (req, res) => {
    let bannerId = req.params.banner_id;

    res.render('forms/schedule-session', {
        bannerId: bannerId
    });
});

// Route to handle POST request when scheduling appointment
app.post('/schedule-session', (req, res) => {

    let errors = [];
    // First, validate form
    if (!req.body.email) {
        errors.push({
            text: "Please add an email"
        })
    }

    if (req.body.email != res.locals.user.email) {
        errors.push({
            text: "Confirmation email does not match records"
        })
    }

    if (!req.body.dayOfWeek) {
        errors.push({
            text: "Please select a day of the week"
        })
    }
    if (!req.body.startTime) {
        errors.push({
            text: "Please select a start time"
        })
    }

    if (!req.body.description) {
        errors.push({
            text: "Please add a description"
        })
    }

    if (errors.length > 0) {

        res.render(`forms/schedule-session`, {
            errors: errors,
            bannerId: req.body.tutorId,
            email: req.body.email,
            description: req.body.description
        });

    } else {
        // If form is valid, add tutoring session to table appointment table 
        let tutorId = req.body.tutorId;
        let day = req.body.dayOfWeek;
        let startTime = req.body.startTime;
        let email = req.body.email;
        let session;
        let sql = 'SELECT * FROM `students` WHERE `email`= ?';

        // Find banner ID using email given
        connection.query(sql, [email], (error, results, fields) => {
            if (error) {
                throw error;
            } else {
                // Make session object to pass to INSERT query
                session = makeSession(req, results);
                sql = 'INSERT INTO appointment SET ?';

                // Insert session information into appointment table
                connection.query(sql, [session], (error, results, fields) => {});

                sql = 'SELECT * FROM `tutors` WHERE `banner_id` = ?'
                // Find tutor and render submitted page with appointment details
                connection.query(sql, [tutorId], (error, results, fields) => {
                    res.render("forms/submitted", {
                        tutorFirstName: results[0].first_name,
                        tutorLastName: results[0].last_name,
                        day: day,
                        startTime: session.start_time,
                        description: session.description
                    });

                });
            }
        });

        let updateSql = 'UPDATE tutor_schedule SET booked = 1 ' +
            'WHERE `tutors_banner_id` = ? and `day` = ? and `start_time` = ?';

        // Update tutor_schedule table as booked for given day and time
        connection.query(updateSql, [tutorId, day, startTime], (error, results, fields) => {});
    }
});

// GET route for updating tutor times available
app.get('/update-time', ensureAuthenticated, (req, res) => {

    let tutorID = req.query.tutor_id;
    let day = req.query.day;

    var sql = 'SELECT `start_time` FROM `tutor_schedule` WHERE `tutors_banner_id`= ? and `day`= ? and `booked`= 0'

    connection.query(sql, [tutorID, day], (error, results, fields) => {

        if (error) {
            throw error;
        } else {
            res.send(results);
        }
    });
});

// Use routes
app.use('/users', users);

const port = 5000;

// Start server
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

// Create and return session object
function makeSession(req, results) {
    let session = {
        appointment_id: null,
        students_banner_id: results[0].banner_id,
        tutors_banner_id: req.body.tutorId,
        day: req.body.dayOfWeek,
        start_time: req.body.startTime,
        description: req.body.description
    };

    return session;
}