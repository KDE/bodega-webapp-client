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
var path = require('path');

var templateFiles = ['mainpage.hbs', 'channel.hbs'];
var jsFiles = ['app.js', 'channels.js', 'routes.js'];

var EmberHelper = (function() {

    function createFiles() {
        function mergeFiles(sourceDir, files, destination, isHTML) {
            var modifiedFile = '';
            // merge the files
            for (var i in files) {
                var file = files[i];
                modifiedFile += fs.readFileSync(sourceDir + file, 'utf8') + '\n';
            }

            if (isHTML !== undefined && isHTML) {
                var temp = fs.readFileSync(sourceDir + 'index.hbs', 'utf8') + '\n';
                modifiedFile = temp.replace("<---- Replace me ---->", modifiedFile);
            }
            // create the new file
            fs.writeFileSync(sourceDir + destination, modifiedFile);
        }

        mergeFiles(__dirname + '/..' + '/public/assets/', jsFiles, '_app.js');
        mergeFiles(__dirname + '/..' + '/public/assets/templates/', templateFiles, '_index.html', true);
    }

    function EmberHelper() {
        createFiles();
    }

    EmberHelper.prototype.renderEmber = function(req, res) {
        if (app.settings.env === 'development') {
            createFiles();
            console.log("The  appropriate emberjs files have been created!!");
        }

        res.sendfile(path.normalize(__dirname + '/..' + '/public/assets/templates/_index.html'))
    };

    return EmberHelper;

})();

module.exports.EmberHelper = EmberHelper;
