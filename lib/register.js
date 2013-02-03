var options = require('./utils.js').options

var communicate = function(req, res, remoteRes, chunk) {
    res.redirect('/register/confirm');
}

var requestUrl = function(req, res) {

    var query = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: req.body.password
    }

    return options('register', query);
}

module.exports.communicate = communicate;
module.exports.requestUrl = requestUrl;
