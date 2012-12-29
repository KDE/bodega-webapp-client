var option = require('./utils.js').options

var username;
var password;
var cookie;

var communicate = function(req, res, remoteRes, chunk) {
    var reply = JSON.parse(chunk.toString('utf8'), 'utf8');

    req.session.authorized = false;

    console.log(remoteRes.headers)

    if (reply.authStatus === true) {
        //auth the user
        req.session.username = username;
        req.session.password = password;
        req.session.points = reply.points;
        req.session.authorized = true;
    }

    res.redirect('login/info');
}

var requestUrl = function(req, res) {
    //TODO remove the hard coded vivaldi
    var query = {
        auth_user: req.body.username,
        auth_password: req.body.password,
        auth_device: "VIVALDI-1"
    }

    username = query.auth_user;
    password = query.auth_password;

    return option('auth', query);
}

var communicate2 = function(req, res, remoteRes, chunk) {
    var reply = JSON.parse(chunk.toString('utf8'), 'utf8');

    req.session.firstname = reply.firstname;
    req.session.lastname = reply.lastname;
    req.session.email = reply.email;

    res.redirect('login/confirm');
}

var requestUrl2 = function(req, res) {
    var options = option('participant/info');

    options.headers = {
        'Cookie': cookie
    }

    return options;
}

module.exports.communicate = communicate;
module.exports.requestUrl = requestUrl;
module.exports.communicate2 = communicate2;
module.exports.requestUrl2 = requestUrl2;
