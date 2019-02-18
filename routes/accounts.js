const express = require('express');
const router = express.Router();

// Sign up route
router.get('/signup', (req, res) => {
    res.render('accounts/signup');
})

// Log in route
router.get('/login', (req, res) => {
    res.render('accounts/login');
})

// Sign up form POST
router.post('/signup', (req, res) => {
    let errors = [];

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
        res.send('passed');
    }
});

module.exports = router;