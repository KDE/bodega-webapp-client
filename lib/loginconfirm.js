var loginConfirm = function(req, res) {
    var success = false;

    //TODO impove the Authorization messages
    var msg = 'Authorization has failed';

    res.render('loginconfirm', {
        message: msg,
        network: app.config.network
    });
}

module.exports = loginConfirm;
