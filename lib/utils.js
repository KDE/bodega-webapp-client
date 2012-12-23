var querystring = require('querystring');
var url = require('url');

var remoteUrl = function(query, pathname) {

    var options = {
        hostname: app.config.bodega,
        port: app.config.port,
        method: 'GET',
        path: app.config.api + pathname  + '?' + querystring.stringify(query)
    }

    console.log(options.path);
    return options;
}

module.exports.options = remoteUrl
