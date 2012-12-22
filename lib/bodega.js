var http = require('http');
var loginRequest = require('./login.js');
var loginConfirm = require('./loginconfirm.js');

var BodegaManager = (function() {

    function BodegaManager() {

    }

    BodegaManager.prototype.connect = function(req, res, func1, func2) {
        http.get(func1(req, res), function(remoteRes) {
            console.log("Got response: " + res.statusCode);
            remoteRes.on('data', function(chunk) {
                func2(req, res, chunk);
            })
        }).on('error', function(e) {
            console.log("Got error: " + e.message);
        });
    }

    BodegaManager.prototype.login = function(req, res) {
        this.connect(req, res, loginRequest.requestUrl, loginRequest.communicate);
    }

    BodegaManager.prototype.loginconfirm = function(req, res) {
        loginConfirm(req, res);
    }


    return BodegaManager;

})();

module.exports.BodegaManager = BodegaManager;
