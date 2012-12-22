var options = require('./utils.js').options

var username;
var password;


var communicate = function(req, res, remoteRes) {
//    var reply = JSON.parse(remoteRes.toString('utf8'), 'utf8');
    var reply = remoteRes.toString('utf8');
    console.log(reply);

    req.session.authorized = false;

    if (reply.authStatus == true) {
        //auth the user
        req.session.username = username;
        req.session.password = password;
    }

    res.redirect('/login/confirm');
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

    return options(query, 'auth');
}

module.exports.communicate = communicate;
module.exports.requestUrl = requestUrl;
