exports.isUser = function (req, res, next) {
    if (req.isAuthenticated()) {
       return next();
    } 
        req.flash('danger', 'Please Log in');
        req.session.oldUrl = req.url;
        res.redirect('/users/login');
    
}




exports.isAdmin = function (req, res, next) {
    if (req.isAuthenticated() && res.locals.user.admin == 1) {
        next();
    } else {
        req.flash('danger', 'Please Log in as Admin');
        res.redirect('/users/login');
    }
}
