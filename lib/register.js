var options = require('./utils.js').options

var communicate = function(req, res, remoteRes) {
    res.redirect('/register/confirm');
}

var requestUrl = function(req, res) {

    var query = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: req.body.password
    }

    return options(query, 'register');
}

module.exports.communicate = communicate;
module.exports.requestUrl = requestUrl;
