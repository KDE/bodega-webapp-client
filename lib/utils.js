var querystring = require('querystring');
var url = require('url');

var remoteUrl = function(pathname, query, auth, useDomainInsteadOfIp) {

    var p = app.config.api + pathname;

    if (query !== undefined && query !== null) {
        p = p + '?' + querystring.stringify(query);
    }

    var options = {
        port: app.config.port,
        method: 'GET',
        path: p
    }

    if (useDomainInsteadOfIp === true && useDomainInsteadOfIp !== undefined) {
        options.hostname = app.config.domain
    } else {
        options.hostname = app.config.bodega
    }

    if (auth !== undefined && auth !== false) {
        options.headers = {
            'Cookie': app.cookie
        };
    }

    console.log(options.path);
    return options;
}

var findImage = function(imageCandidate, size, id) {
    var path = 'http://' + app.config.bodega + ':' +  app.config.port;

    if (path[path.length - 1] !== '/') {
        path += '/';
    }

    path += 'images/' + size + '/';

    if (imageCandidate !== null && imageCandidate !== undefined) {
        path += imageCandidate;
        return path;
    }

    path += 'default/';
    if (id === 23) {
        path += 'wallpaper.png';
    } else {
        path += 'book.png';
    }

    return path;
}

module.exports.options = remoteUrl;
module.exports.findImage = findImage;
