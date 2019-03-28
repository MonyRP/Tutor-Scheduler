const $ = require('jquery');
const express = require('express');
const exphbs = require('express-handlebars');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const faker = require('faker');

const app = express();

// Load routes
const accounts = require('./routes/accounts');

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
app.use('/fullcalendar', express.static(__dirname + '/node_modules/fullcalendar'));
app.use('/moment', express.static(__dirname + '/node_modules/moment'));


// Handlebars middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Body Parser middleware
app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json())

// Method override middleware is used to update and delete (Needs to be installed)
//app.use(methodOverride('_method'));

// Express session midleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use(flash());

// Global variables
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// Home Route
app.get('/', (req, res) => {
    res.render('index');
});

// Scheduled session route
app.get('/schedule-session/:name', (req, res) => {
    let firstName = req.params.name;
    var sql = 'SELECT * FROM `tutors` WHERE `first_name`= ?'


    connection.query(sql, [firstName], (error, results, fields) => {
        let tutor = results[0];
        sql = 'SELECT * FROM `tutor_schedule` WHERE `tutors_banner_id`= ?';

        // Place holder values for testing
        res.render('forms/schedule-session', {
            tutor: tutor,
            startTime: "08:30",
            description: "Help with math"
        });

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
        res.render('forms/schedule-session', {
            errors: errors,
            email: req.body.email,
            dayOfWeek: req.body.dayOfWeek,
            startTime: req.body.startTime,
            description: req.body.description
        });

    } else {
        // If form is valid, add tutoring session to table appointment table 
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
                connection.query(sql, [req.body.tutorId], (error, results, fields) => {
                    res.render("submitted", {
                        tutorFirstName: results[0].first_name,
                        tutorLastName: results[0].last_name,
                        startTime: session.start_time,
                        description: session.description
                    });

                });
            }
        });
    }
});

// GET route for updating tutor times available
app.get('/update-time', (req, res) => {

    let tutorID = req.query.tutor_id;
    let day = req.query.day;

    var sql = 'SELECT `start_time` FROM `tutor_schedule` WHERE `tutors_banner_id`= ? and `day`= ?'

    connection.query(sql, [tutorID, day], (error, results, fields) => {

        if (error) {
            throw error;
        } else {
            res.send(results);
        }
    });
});

// Use routes
app.use('/accounts', accounts);

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

// Function to log query results
function logResults(results) {
    console.log(results);

}