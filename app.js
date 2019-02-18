const express = require('express');
const exphbs = require('express-handlebars');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();

// Load routes
const accounts = require('./routes/accounts');


// Middleware for static files
app.use('/public', express.static(__dirname + '/public'));
app.use('/fullcalendar', express.static(__dirname + '/node_modules/fullcalendar'));
app.use('/moment', express.static(__dirname + '/node_modules/moment'));
app.use('/fullcalendar', express.static(__dirname + '/node_modules/fullcalendar'));


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
app.get('/schedule-session', (req, res) => {
    res.render('forms/schedule-session');
});

// Submitted route
app.post('/submitted', (req, res) => {
    console.log(req.body);
    res.render('submitted');
});

// Use routes
app.use('/accounts', accounts);

const port = 5000;

// Start server
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});



// var firstName = document.getElementById('first-name').value;
// var lastName = document.getElementById('last-name').value;
// var email = document.getElementById("email").value;
// var startTime = document.getElementById('start-time').value;
// var endTime = document.getElementById('end-time').value;
// var description = document.getElementById('description').value;



// var connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'rooting',
//     database: 'tutoring_sessions'
// })



// student = {
//     id: i,
//     first_name: faker.name.firstName(),
//     last_name: faker.name.lastName(),
//     email: faker.internet.email(),
//     start_time: faker.date.past(),
//     end_time: faker.date.past()
// };
// connection.query('INSERT INTO scheduled_sessions SET ?', student, function (error, results, fields) {
//     if (error) throw error;
//     console.log(results);
// });


// connection.end();