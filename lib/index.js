var options = require('./utils.js').options;
var http = require('http');
var sockjs  = require('sockjs');
var utils = require('./utils.js');

//this will apply for all the categories
var assetsPerPage = 24;

//like wallpapers and books
var rootChannels = []; // our channels from bodega/v1/json/channels
var categoriesForJade = []; // this will contain all the categories for the jade
var assetsForJade = []; // this will contain only the required data for the jade

function findImage(imageCandidate) {
    if (imageCandidate === null || imageCandidate === undefined) {
        return utils.findImage(64, this.id);
    }
    return imageCandidate;
}

var doWork = function(req, res) {
    //make sure thar our arrays are clear
    rootChannels = [];
    categoriesForJade = [];
    assetsForJade = [];

    app.BodegaManager.connect(options('channels', null, true), function(remoteRes, chunk) {
        var reply = JSON.parse(chunk.toString('utf8'), 'utf8');

        //take all the root channels
        for(var i in reply.channels) {
            var temp = {
                id: reply.channels[i].id,
                name: reply.channels[i].name,
                description: reply.channels[i].description
            }
            temp.image = findImage(reply.channels[i].image);
            rootChannels.push(temp);
        }

    parseRootChannels(res);
    });
}

function parseRootChannels(res) {
    function next() {
        var root = rootChannels.shift();
        app.BodegaManager.connect(options('channel/' + root.id, null, true), function(remRes, data) {
            //we have more channels
            var r = JSON.parse(data, 'utf8');
            var t1 = {
                name: root.name,
                id: root.id
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
                    subcategory.image = findImage(r.channels[child].image);

                    t1.subcategories.push(subcategory);
                }
            }

            categoriesForJade.push(t1);
            if (rootChannels.length > 0) {
                next();
            } else if (rootChannels.length === 0) {
                res.render('index', {
                    network: app.config.network,
                    categories: categoriesForJade
                });
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

        //sockjs client send the data as categoryId/categoryPage
        var dataArray = data.split('/');
        var categoryId = dataArray[0];
        var categoryPage = dataArray[1];
        var query = {
            pageSize: assetsPerPage,
            offset: assetsPerPage * (categoryPage - 1)
        };

        app.BodegaManager.connect(options('channel/' + categoryId, query, true), function(remRes, data) {
            var assetReply = JSON.parse(data.toString('utf8'), 'utf8');
            var assetArray = [];
            for (var assetIt in assetReply.assets) {
                //take the elements that are after the elements of
                //the previous pageId
                asset = {
                    id: assetReply.assets[assetIt].id,
                    name: assetReply.assets[assetIt].name,
                    version: assetReply.assets[assetIt].version,
                    license: assetReply.assets[assetIt].license
                };
                asset.image = findImage(assetReply.assets[assetIt].image);
                assetArray.push(asset);
            }
            conn.write(JSON.stringify(assetArray));
        });
    });
});

sockjs_echo.installHandlers(app.server, {
    prefix:'/indexTakeAssets'
});

module.exports.doWork = doWork;

