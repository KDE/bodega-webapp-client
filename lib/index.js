var options = require('./utils.js').options;
var http = require('http');
var emitter = require('events').EventEmitter;
var sockjs  = require('sockjs');

//this will apply for all the categories
var assetsPerPage = 24;

//like wallpapers and books
var rootChannels = []; // our channels from bodega/v1/json/channels
var categoriesForJade = []; // this will contain all the categories for the jade
var assetsForJade = []; // this will contain only the required data for the jade

var eventEmitter = new emitter();

//our http.get requests are asynchronous so we
//have to make sure that our code will be called
//asynchronously :)
eventEmitter.parseRootChannels = function(res) {
    this.emit('parseRootChannels', res);
}

eventEmitter.renderJade = function(res) {
    this.emit('renderJade', res);
}

var doWork = function(req, res) {
    //make sure thar our arrays are clear
    rootChannels = [];
    categoriesForJade = [];
    assetsForJade = [];

    app.BodegaManager.connect(options('channels', null, true), function(remoteRes, chunk) {
        var reply = JSON.parse(chunk.toString('utf8'), 'utf8');
        console.log(reply)

        var requestedPageId = 1;
        var requestedChannel = 1;

        //take all the root channels
        for(var i in reply.channels) {
            var temp = {
                id: reply.channels[i].id,
                name: reply.channels[i].name,
                description: reply.channels[i].description,
                image: reply.channels[i].image
            }
            rootChannels.push(temp);
        }

        eventEmitter.parseRootChannels(res);
    });
}

eventEmitter.on('parseRootChannels', function(res) {
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
                        description: r.channels[child].description,
                        image: r.channels[child].image //TODO  it may be null
                    };
                    t1.subcategories.push(subcategory);
                }
            }

            categoriesForJade.push(t1);
            if (rootChannels.length > 0) {
                next();
            } else if (rootChannels.length === 0) {
                eventEmitter.renderJade(res);
            }
        });

    }

    next();
});

eventEmitter.on('renderJade', function(res) {
    res.render('index', {
        network: app.config.network,
        categories: categoriesForJade
    });
});

//sockjs stuff
var sockjs_opts = {
    sockjs_url: "http://cdn.sockjs.org/sockjs-0.3.min.js"
};

var sockjs_echo = sockjs.createServer(sockjs_opts);
sockjs_echo.on('connection', function(conn) {
    conn.on('data', function(categoryId, categoryPage) {
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
                    license: assetReply.assets[assetIt].license,
                    image: function() {
                        var image = assetReply.assets[assetIt].image;
                        if(image === undefined || image === null) {
                            //TODO take a generic image
                            return null;
                        } else {
                            return image;
                        }
                    }
                };
                assetArray.push(asset);
            }
            conn.write(assetArray);
        });
    });
});

sockjs_echo.installHandlers(app.server, {
    prefix:'/indexTakeAssets'
});

module.exports.doWork = doWork;

