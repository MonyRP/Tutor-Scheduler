module.exports = {

    ensureAuthenticated: function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash('error_msg', 'Not Authorized');
        res.redirect('/users/login/student');
    },

    ensureStudent: function (req, res, next) {
        if (req.isAuthenticated()) {
            if (res.locals.user.isStudent) {
                return next();
            }
        }
        req.flash('error_msg', 'Must Be Student To Access');
        res.redirect('/users/login/student');
    },

    ensureTutor: function (req, res, next) {
        if (req.isAuthenticated()) {
            if (res.locals.user.isTutor) {
                return next();
            }
        }
        req.flash('error_msg', 'Must Be Tutor To Access');
        res.redirect('/users/login/tutor');
    },

    ensureAdmin: function (req, res, next) {
        if (req.isAuthenticated()) {
            if (res.locals.user.isAdmin) {
                return next();
            }
        }
        req.flash('error_msg', 'Must Be Admin To Access');
        res.redirect('/users/login/admin');
    }

}