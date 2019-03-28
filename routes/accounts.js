const $ = require('jquery');
const express = require('express');
const exphbs = require('express-handlebars');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const router = express.Router();

// Connect to database
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'rooting',
    database: 'tutoring_sessions'
});

// Sign up route
router.get('/signup', (req, res) => {
    res.render('accounts/signup');
});

// Login route
router.get('/login', (req, res) => {
    res.render('accounts/login');
})

// Login post
router.post("/login", (req, res) => {
   

});

// Sign up form POST
router.post('/signup', (req, res) => {
    let errors = [];
    let student = {};

    if (req.body.password != req.body.password2) {
        errors.push({
            text: 'Passwords must match.'
        });
    }

    if (req.body.password.length < 4) {
        errors.push({
            text: 'Password length must be at least 4 characters.'
        });
    }

    if (errors.length > 0) {
        res.render('accounts/signup', {
            errors: errors,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            bannerId: req.body.bannerId,
            email: req.body.email,
            password: req.body.password,
            password2: req.body.password2
        });
    } else {
        res.render('index');

        student = {
            banner_id: req.body.bannerId,
            first_name: req.body.firstName,
            last_name: req.body.lastName,
            email: req.body.email

        }
    }
});

module.exports = router;