/*
    Copyright 2013 Giorgos Tsiapaliokas <terietor@gmail.com>
    Copyright 2013 Antonis Tsiapaliokas <kok3rs@gmail.com>

    This program is free software; you can redistribute it and/or
    modify it under the terms of the GNU General Public License as
    published by the Free Software Foundation; either version 2 of
    the License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

var querystring = require('querystring');
var url = require('url');

var options = function(req, pathname, query, auth, useDomainInsteadOfIp) {

    var p = app.config.server.api + pathname;

    console.log(app.config.server.api)
    console.log(pathname)
    console.log(JSON.stringify(p))

    if (query !== undefined && query !== null) {
        p = p + '?' + querystring.stringify(query);
    }

    var options = {
        hostname: app.config.server.hostname,
        port: app.config.server.port,
        method: 'GET',
        path: p,
        headers: {}
    };

    if (auth !== undefined && auth !== false && req && req.session) {
        options.headers = {
            'Cookie': req.session.servercookie
        };
    }

    return options;
};

var findImage = function(imageCandidate, size, id) {
    var path = 'http://' + app.config.server.hostname + ':' +  app.config.server.port;

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
};

module.exports.options = options;
module.exports.findImage = findImage;
