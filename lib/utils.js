var querystring = require('querystring');
var url = require('url');

var remoteUrl = function(pathname, query, auth) {

    var p = app.config.api + pathname;

    if (query !== undefined) {
        p = p + '?' + querystring.stringify(query);
    }

    var options = {
        hostname: app.config.bodega,
        port: app.config.port,
        method: 'GET',
        path: p
    }

    if (auth !== undefined && auth !== false) {
        options.headers = {
            'Cookie': app.cookie
        }
    }

    console.log(options.path);
    return options;
}

module.exports.options = remoteUrl;
