var options = require('./utils.js').options;
var http = require('http');
var emitter = require('events').EventEmitter;

//this will apply for all the categories
var assetsPerPage = 21;
//like wallpapers and books
var rootChannels = []; // our channels from bodega/v1/json/channels
var categoriesForJade = []; // this will contain all the categories for the jade
var assetsForJade = []; // this will contain only the required data for the jade
var hasMoreChannels = true;

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
        });

        if (rootChannels.length > 0) {
            next();
        }
    }

    next();
});

eventEmitter.on('renderJade', function(res) {
    var json = {
        "categories": categoriesForJade
     };
    res.json(json);
});

function parseAssets(assets) {
    var assetArray = [];
    //TODO the pageId must go here
    var assetIt = 0;
    //let the loop continue until we have the required
    //element for the number of pages that we have
    while (assetIt < pageId * assetsPerPage) {
        //take the elements that are after the elements of
        //the previous pageId
        if (assetIt > (pageId - 1) * assetsPerPage)
            asset = {
                id: assets[assetIt].id,
                    name: assets[assetIt].name,
                    version: assets[assetIt].version,
                    license: assets[assetIt].license,
                    image: assets[assetIt].image
            };

            console.log("assetsssssssssssss" + asset.name)
            assetArray.push(asset);
    }

    data = {
        channelName: rootChannels[it].name,
        assets: assetArray
    };

    if (assets.length > pageId * assetsPerPage) {
        data.hasNextPage = true;
    } else {
        data.hasNextPage = false;
    }

    return data;
}

module.exports.doWork = doWork;

