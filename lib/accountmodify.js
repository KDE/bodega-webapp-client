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

    list = ['firstname', 'firstName', 'lastname', 'lastName', 'email', 'email', 'password', 'password'];

    var i = 0;
    while(i < list.length) {

        var key1 = list[i];
        var key2 = list[i+1];

        if (req.body[key1] !== undefined && req.session[key1] !== req.body[key1]) {
            query[key2] = req.body[key1];
            if (key1 === 'password') {
                var options = option('participant/changePassword', query);
            }
        }
        //increase i
        i = i + 2;
    }

    return option('participant/changeAccountDetails', query);

}

module.exports.communicate = communicate;
module.exports.requestUrl = requestUrl;

