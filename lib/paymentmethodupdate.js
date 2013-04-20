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

var option = require('./utils.js').options

var communicate = function(req, res, remoteRes, chunk) {
    var reply = JSON.parse(chunk.toString('utf8'), 'utf8');

    if (reply.error) {
        app.operationStatus = false;
        app.operationMessage = reply.error.type;
        res.redirect('/account/paymentMethod/update/confirm');
    } else {
        app.operationStatus = true;
        app.operationMessage = 'Your payment method has been updated successfuly';
        res.redirect('/account/paymentMethod/update/confirm');
    }
}

var requestUrl = function(req, res) {
    var card = {};

    var query = {
        "card[name]": req.body.inputName,
        "card[number]": req.body.inputNumber,
        "card[exp_month]": req.body.inputMonthExpires,
        "card[exp_year]": req.body.inputYearExpires
    };

    var options = option('participant/changeAccountDetails', query, true);

    return options;
}

module.exports.communicate = communicate;
module.exports.requestUrl = requestUrl;
