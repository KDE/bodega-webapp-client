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

var options = require('./utils.js').options;
var http = require('http');
var sockjs  = require('sockjs');
var utils = require('./utils.js');
var async = require('async');

//this will apply for all the categories
var assetsPerPage = 24;

var doWork = function(req, res) {
    //like wallpapers and books
    var categoriesForJade = []; // this will contain all the categories for the jade

    async.parallel([
        function(callback) {
            //start to parse the channels
            app.BodegaManager.connect(options('channels', null, true), function(remoteRes, chunk) {
                var reply = JSON.parse(chunk.toString('utf8'), 'utf8');

                //like wallpapers and books
                var rootChannels = []; // our channels from bodega/v1/json/channels

                //take all the root channels
                for(var i in reply.channels) {
                    var temp = {
                        id: reply.channels[i].id,
                        name: reply.channels[i].name,
                        description: reply.channels[i].description,
                        assetcount: reply.channels[i].assetcount,
                        isCollection: false
                    };
                    temp.image = utils.findImage(reply.channels[i].image, 64, this.id);
                    rootChannels.push(temp);
                }

                parseRootChannels(rootChannels, categoriesForJade, callback);
            });
        },
        function(callback) {
            //start to parse the collections
            app.BodegaManager.connect(options('collections/list', null, true), function(remoteRes, chunk) {
                var reply = JSON.parse(chunk.toString('utf8'), 'utf8');
                console.log(reply)
                for (var i in reply.collections) {
                    var temp = {
                        name: reply.collections[i].name,
                        id: reply.collections[i].id,
                        isCollection: true
                    };
                    categoriesForJade.push(temp);
                }
                callback(null, undefined);
            });
        }
        ],
        function(err, results) {
            if (err !== null) {
                console.log(err);
            }

            //give the data to the jade
            res.render('index', {
                network: app.config.network,
                categories: categoriesForJade
            });
        });
};

function parseRootChannels(rootChannels, categoriesForJade, callback) {
    function next() {

        function findPages(assetcount) {
            var pages = ~~(assetcount / assetsPerPage);
            if ((assetcount % assetsPerPage) !== 0) {
                pages++;
            }
            return pages;
        }

        var root = rootChannels.shift();
        app.BodegaManager.connect(options('channel/' + root.id, null, true), function(remRes, data) {
            //we have more channels
            var r = JSON.parse(data, 'utf8');
            var t1 = {
                name: root.name,
                id: root.id,
                image: root.image,
                assetcount: root.assetcount
            };

            t1.subcategories = [];
            if (r.channels.length > 0) {
                //so we have more channels, so lets think
                //a bit. We want every channel to show its children
                //in the ui, so lets make all of those children into
                //subcategories
                var subcategories = [];

                for (var child in r.channels) {
                    var subcategory = {
                        id: r.channels[child].id,
                        name: r.channels[child].name,
                        description: r.channels[child].description
                    };

                    subcategory.pages = findPages(r.channels[child].assetcount);
                    subcategory.image = utils.findImage(r.channels[child].image, 64, this.id);
                    t1.subcategories.push(subcategory);
                }
            } else {
                t1.pages = findPages(t1.assetcount);
            }

            //don't give the assetcount into the jade, for jade we have the pages property
            delete t1.assetcount;

            categoriesForJade.push(t1);
            if (rootChannels.length > 0) {
                next();
            } else if (rootChannels.length === 0) {
                callback(null, undefined);
            }
        });
    }

    next();
}

//sockjs stuff
var sockjs_opts = {
    sockjs_url: "http://cdn.sockjs.org/sockjs-0.3.min.js"
};

var sockjs_echo = sockjs.createServer(sockjs_opts);
sockjs_echo.on('connection', function(conn) {
    conn.on('data', function(data) {

        //sockjs client sends the data as collection/categoryId/categoryPage
        //or channel/categoryId/categoryPage
        var dataArray = data.split('/');
        var isCollection = dataArray[0] == 'collection' ? true : false;
        var categoryId = dataArray[1];
        var categoryPage = dataArray[2];
        var channelQuery = {
            pageSize: assetsPerPage,
            offset: assetsPerPage * (categoryPage - 1)
        };

        var collectionQuery = {
            pageSize: assetsPerPage,
            offset: assetsPerPage * (categoryPage - 1),
            collectionId: categoryId
        }

        if (isCollection) {
            app.BodegaManager.connect(options('collections/listAssets', collectionQueryQuery, true), function(remRes, data) {
                parseAssetsFromJson(data, function(assetsResult) {
                    console.log(assetsResult)
                    conn.write(assetsResult);
                });
            });
        } else {
            app.BodegaManager.connect(options('channel/' + categoryId, channelQuery, true), function(remRes, data) {
                parseAssetsFromJson(data, function(assetsResult) {
                    conn.write(assetsResult);
                });
            });
        }
    });
});

var parseAssetsFromJson = function(json, cb) {
    var assetArray = [];
    var assetReply = JSON.parse(json.toString('utf8'), 'utf8');
    for (var assetIt in assetReply.assets) {
        //take the elements that are after the elements of
        //the previous pageId
        var asset = {
            id: assetReply.assets[assetIt].id,
            name: assetReply.assets[assetIt].name,
            version: assetReply.assets[assetIt].version,
            license: assetReply.assets[assetIt].license,
            author: assetReply.assets[assetIt].partnername
        };

        asset.image = utils.findImage(assetReply.assets[assetIt].image, 128, this.id);
        asset.largeImage = utils.findImage(assetReply.assets[assetIt].image, 256, this.id);
        assetArray.push(asset);
    }

    if (cb !== undefined) {
        cb(JSON.stringify(assetArray));
    }
}

sockjs_echo.installHandlers(app.server, {
    prefix:'/indexTakeAssets'
});

module.exports.doWork = doWork;

