var option = require('./utils.js').options

var communicate = function(req, res, remoteRes, chunk) {
    var reply = JSON.parse(chunk.toString('utf8'), 'utf8');

    console.log(reply)
    req.session.firstname = reply.firstName;
    req.session.lastname = reply.lastName;
    req.session.email = reply.email;

    res.redirect('login/confirm');
}

var requestUrl = function(req, res) {
    var options = option('participant/info');

    options.headers = {
        'Cookie': app.cookie
    }

    return options;
}

module.exports.communicate = communicate;
module.exports.requestUrl = requestUrl;
