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

var option = require('./utils.js').options;

var communicate = function(req, res, remoteRes, chunk) {
    var reply = JSON.parse(chunk.toString('utf8'), 'utf8');

    if (reply.error) {
        res.render('pointsbuyconfirm', {
            network: app.config.server.name,
            message: reply.error.type,
            success: false
        });
    } else {
        res.render('pointsbuyconfirm', {
            network: app.config.server.name,
            message: reply,
            success: true
        });
    }
};

var requestUrl = function(req, res) {

    var query = {
            amount : req.body.points
    };

    var options = option(req, 'points/buy', query, true);

    return options;
};

module.exports.communicate = communicate;
module.exports.requestUrl = requestUrl;
