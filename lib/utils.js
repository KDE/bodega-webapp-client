var querystring = require('querystring');
var url = require('url');

var remoteUrl = function(pathname, query) {

    var p = app.config.api + pathname;

    if (typeof query !== 'undefined') {
        p = p + '?' + querystring.stringify(query);
    }

    var options = {
        hostname: app.config.bodega,
        port: app.config.port,
        method: 'GET',
        path: p
    }

    console.log(options.path);
    return options;
}

module.exports.options = remoteUrl
