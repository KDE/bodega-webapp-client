var options = require('./utils.js').options
var http = require('http');

//this will apply for all the categories
var assetsPerPage = 21;

function parseRecursively(channelList, hasMoreChannels) {
    var nextSubcategories = [];
    //now iterate in the root channels
    for (it in channelList) {
        app.BodegaManager.connect(options('channel/' + channelList[it].id, null, true), function(data) {
            //we have more channels
            console.log("here")
            var r = JSON.parse(data, 'utf8');
            console.log(r)
            if (r.channels.length > 0) {
                //so we have more channels, so lets think
                //a bit. We want every channel to show its children
                //in the ui, so lets make all of those children into
                //subcategories

                //rootChannels[it].subcategories = parseChildChannels(r.channels);
                nextSubcategories = parseChildChannels(r.channels)

                //categoriesForJade.push([rootChannels[it].name, rootChannels[it].subcategories]);
                categoriesForJade.push([channelList[it].name, nextSubcategories]);
                //TODO we also need the data from the subcategories
            } else {
                categoriesForJade.push(channelList[it].name);
                hasMoreChannels = false;
            }

            //lets check if our rootChannel has also assets
            if (r.assets.length > 0) {
                //now lets take those assets
                if (channelList[it].name === mainCategory);
                    assetsForJade.push(parseAssets(r.assets));
                }
        });
    }
    return nextSubcategories;
}

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

function parseChildChannels(childrenChannels) {
    parentSubcategoryArray = [];
    for (child in childrenChannels) {
        subcategory = {
            id: childrenChannels[child].id,
            name: childrenChannels[child].name,
            description: childrenChannels[child].description,
            image: childrenChannels[child].image //TODO  it may be null
        };
        parentSubcategoryArray.push(subcategory);
        console.log("subcategoryyyyyyyyyyyyyyy" + subcategory.name)
    }
            return parentSubcategoryArray;
}

var communicate = function(req, res, remoteRes, chunk) {
    function parseRootChannels() {
        var hasMoreChannels = true;
        var tempList = rootChannels;

        while (hasMoreChannels) {
            tempList = parseRecursively(tempList, hasMoreChannels)
        }
    }

    var reply = JSON.parse(chunk.toString('utf8'), 'utf8');
    console.log(reply)
    var mainCategory = null;
    var category2 = null
    var pageId = 1;
    var hasParams = false;

    for (k in req.params) {
        hasParams = true;
    }

    if (!hasParams) {
        //the user has requested a url like
        //sample.org/index
        mainCategory = 'Wallpapers';
    } else {
        //in the ui we can only show the assets from one category
        //so take only one category as the main category
        if (req.params.subcategory !== undefined) {
            mainCategory = req.params.subcategory;
        } else {
            mainCategory = req.params.category;
        }

        if (req.params.pageId !== undefined) {
            pageId = req.params.pageId;
        }
    }


    //like wallpapers and books
    var rootChannels = []; // in this one we will throw whatever we want, we need it
                            // in order to populate the next 2
    var categoriesForJade = []; // this will contain all the categories for the jade
    var assetsForJade = []; // this will contain only the required data for the jade

    //take all the root channels
    for(i in reply.channels) {
        var temp = {
            id: reply.channels[i].id,
            name: reply.channels[i].name,
            description: reply.channels[i].description,
            image: reply.channels[i].image
        }
        rootChannels.push(temp)
    }

    parseRootChannels();

    res.json({
        a: "a"
    })
}

var requestUrl = function(req, res) {
    return options('channels', null, true);
}

module.exports.communicate = communicate;
module.exports.requestUrl = requestUrl;
