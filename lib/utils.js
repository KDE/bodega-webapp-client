var querystring = require('querystring');
var url = require('url');

var remoteUrl = function(query, pathname) {

    var p = {
        protocol: 'http',
        hostname: app.config.bodega,
        port: app.config.port,
        pathname: app.config.api + pathname,
        search: querystring.stringify(query)
    }

    var options = {
        hostname: app.config.bodega,
        port: app.config.port,
        method: 'GET',
        path: url.format(p)
    }

    console.log(options.path);
    return options;

}
module.exports.options = remoteUrl
