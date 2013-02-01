var option = require('./utils.js').options

var username;
var password;

var communicate = function(req, res, remoteRes, chunk) {
    var reply = JSON.parse(chunk.toString('utf8'), 'utf8');

    req.session.authorized = false;

    console.log(remoteRes.headers)

    if (reply.authStatus === true) {
        //auth the user
        req.session.username = username;
        req.session.password = password;
        req.session.points = reply.points;
        req.session.userId = reply.userId;
        req.session.authorized = true;
        app.cookie = remoteRes.headers['set-cookie'];
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

module.exports.communicate = communicate;
module.exports.requestUrl = requestUrl;

