var options = require('./utils.js').options

var communicate = function(req, res, remoteRes) {
    var reply = JSON.parse(remoteRes, 'utf8');
    console.log(reply);
}

var requestUrl = function(req, res) {
    //TODO remove the hard coded vivaldi
    var query = {
        auth_user: req.body.username,
        auth_password: req.body.password,
        auth_device: "VIVALDI-1"
    }

    return options(query, 'auth');
}

module.exports.communicate = communicate;
module.exports.requestUrl = requestUrl;
