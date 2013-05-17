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

    //on every new account there is not payment method
    //so we are redirecting the user to the payment method
    //create jade, in order to add a payment method
    if (reply.error && reply.error.type === 'PurchaseMethodMissing') {
        res.redirect('/account/paymentMethod/create');
    } else if (reply.error) {
        res.render('paymentmethodupdate', {
            network: app.config.server.name,
            message: reply.error.type,
            success: false
        });
    } else {
        res.render('paymentmethodupdate', {
            network: app.config.server.name,
            message: null,
            success: true,
            cardType: reply.card.type,
            cardName: reply.card.name,
            cardYearExpire: reply.card.exp_year,
            cardMonthExpire: reply.card.exp_month
        });
    }
};

var requestUrl = function(req, res) {

    var options = option('participant/paymentMethod', null, true);

    return options;
};

module.exports.communicate = communicate;
module.exports.requestUrl = requestUrl;
