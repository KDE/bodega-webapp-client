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
console.log(req.body.firstname)
    if (req.session.firstname !== req.body.firstname) {
        query.firstname = req.body.firstname;
    } else if (req.session.lastname !== req.body.lastname) {
        query.lastname = req.body.lastname;
    } else if (req.session.email !== req.body.email) {
        query.email = req.body.email;
    } else if (req.session.password !== req.body.password) {
        query.password = req.body.password;
    } else {
        console.log("on modify account nothing has been modified")
        return;
    }

    return option('participant/changePassword', query);
}

module.exports.communicate = communicate;
module.exports.requestUrl = requestUrl;

