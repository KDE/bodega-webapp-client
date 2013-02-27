var option = require('./utils.js').options

app.EventHandler.on('takeDataForParticipantInfo', function(req, res) {
    function communicate(req, res, remoteRes, chunk) {
        var reply = JSON.parse(chunk.toString('utf8'), 'utf8');
        console.log(reply)
        req.session.firstname = reply.firstName;
        req.session.lastname = reply.lastName;
        req.session.email = reply.email;
    }

    function requestUrl(req, res) {
        var options = option('participant/info', null, true);

        console.log(options.path)
        return options;
    }
    app.BodegaManager.connect(requestUrl, communicate, req, res);
});

