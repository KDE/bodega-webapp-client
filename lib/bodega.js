var http = require('http');
var loginRequest = require('./login.js');
var loginInfo = require('./logininfo.js');
var loginConfirm = require('./loginconfirm.js');
var registerRequest = require('./register.js');
var accountmodify = require('./accountmodify.js')

var BodegaManager = (function() {

    function BodegaManager() {

    }

    BodegaManager.prototype.connect = function(req, res, func1, func2) {
        http.get(func1(req, res), function(remoteRes) {
            console.log("Got response: " + remoteRes.statusCode);
            remoteRes.on('data', function(chunk) {
                func2(req, res, remoteRes, chunk);
            })
        }).on('error', function(e) {
            console.log("Got error: " + e.message);
        });
    }

    BodegaManager.prototype.login = function(req, res) {
        //connect as the user
        this.connect(req, res, loginRequest.requestUrl, loginRequest.communicate);
    }

    BodegaManager.prototype.loginconfirm = function(req, res) {
        loginConfirm(req, res);
    }

    BodegaManager.prototype.loginInfo = function(req, res){
        //now take more info
        this.connect(req, res, loginInfo.requestUrl, loginInfo.communicate);
    }

    BodegaManager.prototype.register = function(req, res) {
        this.connect(req, res, registerRequest.requestUrl, registerRequest.communicate);
    }

    BodegaManager.prototype.accountmodify = function(req, res) {
        this.connect(req, res, accountmodify.requestUrl, accountmodify.communicate);
    }

    return BodegaManager;

})();

module.exports.BodegaManager = BodegaManager;
