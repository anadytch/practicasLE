const helpers = {};

helpers.isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error_msj', 'No estas autorizado');
    res.redirect('/users/signIn');
};

module.exports = helpers;