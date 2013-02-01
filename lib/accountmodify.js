var option = require('./utils.js').options

var communicate = function(req, res, remoteRes, chunk) {
    var reply = JSON.parse(chunk.toString('utf8'), 'utf8');

    console.log(reply)

    app.operationStatus = reply.success;
    res.redirect('account/modify/confirm');
}

var requestUrl = function(req, res) {

    var query = {};

    list = ['firstname', 'firstName', 'lastname', 'lastName', 'email', 'email', 'password', 'password'];

    var i = 0;
    while(i < list.length) {

        var key1 = list[i];
        var key2 = list[i+1];

        if (req.body[key1] !== undefined && req.session[key1] !== req.body[key1]) {
            if (key1 === 'password') {
                query.newPassword = req.body.password;
                return option('participant/changePassword', query, true);
            } else {
                query[key2] = req.body[key1];
            }
        }
        //increase i
        i = i + 2;
    }

    return option('participant/changeAccountDetails', query, true);
}

module.exports.communicate = communicate;
module.exports.requestUrl = requestUrl;

