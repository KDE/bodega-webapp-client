var loginConfirm = function(req, res) {
    var success = false;

    //TODO impove the Authorization messages
    var msg = 'Authorization has failed';

    if (req.session.authorized) {
        success = true;
        msg = 'Authorized successfully';
    }

    res.render('loginconfirm', {
        success: success,
        message: msg,
        network: app.config.network
    });

    //res.redirect('/');
}


module.exports = loginConfirm;
