var option = require('./utils.js').options

var communicate = function(req, res, remoteRes, chunk) {
    var reply = JSON.parse(chunk.toString('utf8'), 'utf8');

    console.log(reply)

    /*if (reply.authStatus === true) {
        //auth the user
        req.session.username = username;
        req.session.password = password;
        req.session.points = reply.points;
        req.session.authorized = true;
        app.cookie = remoteRes.headers['set-cookie'];
    }*/

    //res.redirect('accountmodify/confirm');
    res.redirect('/');
}

var requestUrl = function(req, res) {

    var query = {};

    list = ['firstname', 'lastname', 'email', 'password'];

    for (i in list) {
        var key = list[i];

        if (req.body[key] !== undefined && req.session[key] !== req.body[key]) {
            query[key] = req.body[key];
            if (key === 'password') {
                var options = option('participant/changePassword', query);
            }
        }
    }

    return option('participant/changeAccountDetails', query);

}

module.exports.communicate = communicate;
module.exports.requestUrl = requestUrl;

