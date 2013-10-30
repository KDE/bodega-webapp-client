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
var fs = require('fs');

var templateFiles = [];
var jsFiles = ['app.js'];

var EmberHelper = (function() {

    function EmberHelper() {
        var path = __dirname + '/..' + '/public/assets/';

        var modifiedJsFile = '';
        // merge the files
        for (var i in jsFiles) {
            var jsFile = jsFiles[i];
            modifiedJsFile += '///////////////////// Start of ' + jsFile + '\n';
            modifiedJsFile += fs.readFileSync(path + jsFile, 'utf8') + '\n';
            modifiedJsFile += '//////////////////// End of ' + jsFile + '\n\n';
        }
        // create the new file
        fs.writeFileSync(path + '_app.js', modifiedJsFile);
    }

    EmberHelper.prototype.renderEmber = function(req, res) {
        res.sendfile(path + '_index.html')
    };

    return EmberHelper;

})();

module.exports.EmberHelper = EmberHelper;
