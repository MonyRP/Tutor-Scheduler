const express = require('express');
const exphbs = require('express-handlebars');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const mysql = require('mysql');
const {
    ensureAuthenticated,
    ensureStudent,
    ensureTutor,
    ensureAdmin
} = require('../helpers/auth');

const router = express.Router();

// Connect to database
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'rooting',
    database: 'tutor_scheduler'
});

// Sign up route
router.get('/signup', (req, res) => {
    res.render('users/signup');
});

// Student login route
router.get('/login/student', (req, res) => {
    res.render('users/student-login');
});

// Tutor login route
router.get('/login/tutor', (req, res) => {
    res.render('users/tutor-login');
});

// Student login form POST
router.post('/login/student', (req, res, next) => {
    passport.authenticate('student', {
        successRedirect: '/',
        failureRedirect: '/users/login/student',
        failureFlash: true
    })(req, res, next);
});

// Tutor login form POST
router.post('/login/tutor', (req, res, next) => {
    passport.authenticate('tutor', {
        successRedirect: '/users/tutor/home',
        failureRedirect: '/users/login/tutor',
        failureFlash: true
    })(req, res, next);
});

// Tutor home route
router.get('/tutor/home', ensureTutor, (req, res) => {
    let tutorBannerId = res.locals.user.banner_id;
    let sql = 'SELECT * FROM `appointment` ' +
        'INNER JOIN `students` ' +
        'ON appointment.students_banner_id = students.banner_id ' +
        'WHERE appointment.tutors_banner_id = ? ' +
        ' ORDER BY `start_time` ASC';

    connection.query(sql, [tutorBannerId], (error, results, fields) => {
        res.render('users/tutor-home', {
            appointment: results
        });
    });
});

// Admin login GET route
router.get('/login/admin', (req, res) => {
    res.render('users/admin-login');
});

//Admin login POST route
router.post('/login/admin', (req, res, next) => {
    passport.authenticate('admin', {
        successRedirect: '/users/admin/set-schedule',
        failureRedirect: '/users/login/admin',
        failureFlash: true
    })(req, res, next);
});

// Admin set schedule GET route
router.get('/admin/set-schedule', ensureAdmin, (req, res) => {
    res.render('users/set-schedule');
});

// Admin set schedule POST route
router.post('/admin/set-schedule', ensureAdmin, (req, res) => {
    let schedule = {
        tutor_schedule_id: null,
        tutors_banner_id: req.body.bannerId,
        day: req.body.dayOfWeek,
        start_time: req.body.startTime,
        booked: 0
    }
    let sql = 'INSERT INTO `tutor_schedule` SET ?'

    connection.query(sql, [schedule], (error, results, fields) => {
        res.render('users/set-schedule');
    });

});

// Create tutor GET route
router.get('/admin/create-tutor', ensureAdmin, (req, res) => {
    res.render('users/create-tutor');

});

// Create tutor POST route
router.post('/admin/create-tutor', (req, res) => {
    let math = req.body.math ? 1 : 0;
    let science = req.body.science ? 1 : 0;
    let english = req.body.english ? 1 : 0;
    let history = req.body.history ? 1 : 0;
    let engineering = req.body.engineering ? 1 : 0;
    let business = req.body.business ? 1 : 0;

    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(req.body.password, salt);

    let tutor = {
        banner_id: req.body.bannerId || null,
        first_name: req.body.firstName,
        last_name: req.body.lastName,
        email: req.body.email,
        password: hash,
        math: math,
        science: science,
        english: english,
        history: history,
        engineering: engineering,
        business: business
    }

    let sql = 'INSERT INTO `tutors` SET ?';

    connection.query(sql, [tutor], (error, results, fields) => {
        if (error) {
            console.log(error);
        }
        res.render('users/create-tutor');
    });
});

// Delete tutor GET route
router.get('/admin/delete-tutor', ensureAdmin, (req, res) => {
    res.render('users/delete-tutor');

});

// Delete tutor POST route
router.post('/admin/delete-tutor', (req, res) => {
    let banner_id = req.body.bannerId;

    let sql = 'DELETE FROM `tutors` WHERE `banner_id` = ?';

    connection.query(sql, [banner_id], (error, results, fields) => {
        if (error) {
            console.log(error);
        }
        res.render('users/delete-tutor');
    });
});

// Delete tutor schedule GET route
router.get('/admin/delete-schedule', ensureAdmin, (req, res) => {
    res.render('users/delete-schedule');
});

// Delete tutor schedule POST route
router.post('/admin/delete-schedule', (req, res) => {
    let schedule = {
        tutor_schedule_id: null,
        tutors_banner_id: req.body.bannerId,
        day: req.body.dayOfWeek,
        start_time: req.body.startTime,
        booked: 0
    }
    let sql = 'DELETE FROM `tutor_schedule` WHERE `tutors_banner_id`= ? AND `day`= ? AND `start_time`= ?'

    connection.query(sql, [schedule.tutors_banner_id, schedule.day, schedule.start_time], (error, results, fields) => {
        if (error) {
            console.log(error);
        }
        res.render('users/delete-schedule');
    });
});

// Logout user
router.get('/logout', function (req, res) {
    req.logout();
    res.locals.isTutor = false;
    req.flash('success_msg', 'You are now logged out.')
    res.redirect('/users/login/student');
});

// Student account GET route
router.get('/student/my-account', ensureStudent, (req, res) => {
    let studentBannerId = res.locals.user.banner_id;
    let sql = 'SELECT * FROM `appointment` ' +
        'INNER JOIN `tutors` ' +
        'ON appointment.tutors_banner_id = tutors.banner_id ' +
        'WHERE appointment.students_banner_id = ? ' +
        ' ORDER BY `start_time` ASC';

    connection.query(sql, [studentBannerId], (error, results, fields) => {
        res.render('users/my-account', {
            appointment: results
        });
    });
});

// Create and return session object
function addSession(appointment, tutorFirstName, tutorLastName, sessions) {
    let session = {
        appointmentId: appointment.appointment_id,
        tutorFirstName: tutorFirstName,
        tutorLastName: tutorLastName,
        day: appointment.day,
        startTime: appointment.start_time,
        description: appointment.description
    };
    return session;
}

module.exports = router;