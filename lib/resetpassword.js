var options = require('./utils.js').options

var communicate = function(req, res, remoteRes, chunk) {
    var reply = JSON.parse(chunk.toString('utf8'), 'utf8');
    console.log(reply);

    //TODO if the reset password fails, then the bodega server is sending
    //a differemt json message. Parse that to find the correct error.
    //E.x. put a wrong email address.
    if (reply.message) {
        app.operationStatus = true;
        app.operationMessage = reply.message;
    } else {
        app.operationStatus = false;
    }

    res.redirect('account/resetPassword/confirm');
}

var requestUrl = function(req, res) {

    var query = {
        email: req.body.email
    }

    return options('participant/resetRequest', query, null, true);
}

module.exports.communicate = communicate;
module.exports.requestUrl = requestUrl;
