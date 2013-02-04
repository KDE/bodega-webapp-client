var options = require('./utils.js').options
var http = require('http');

//this will apply for all the categories
var assetsPerPage = 21;

var communicate = function(req, res, remoteRes, chunk) {

    var reply = JSON.parse(chunk.toString('utf8'), 'utf8');

    var mainCategory = null;
    var category2 = null
    var pageId = null;
    var hasParams = false;

    for (k in req.params) {
        hasParams = true;
    }

    if (!hasParams) {
        //the user has requested a url like
        //sample.org/index
        mainCategory = 'Wallpapers';
    } else {
        mainCategory = req.params.category;
        if (req.params.subcategory !== undefined) {
            category2 = req.params.subcategory;
        }

        if (req.params.pageId !== undefined) {
            pageId = req.params.pageId;
        }
    }


    //like wallpapers and books
    var rootChannels = []; // in this one we will throw whatever we want, we need it
                            // in order to populate the next 2
    var categoriesForJade = []; // this will contain all the categories for the jade
    var dataForJade = []; // this will contain only the required data for the jade

    //take all the root channels
    for(i in reply.channels) {
        var temp = {
            id: reply.channels[i].id,
            name: reply.channels[i].name,
            description: reply.channels[i].description,
            image: reply.channels[i].image
        }

        if (mainCategory == temp.name) {
            dataForJade.mainCategory = temp;
        }
        rootChannels.push(temp)
    }

    parseRootChannels();

    //below you will see that I define some methods
    //inside this method, in js this is valid and also
    //it limits the scope of those methods. We want to use those methods
    //only in this method(communicate) so there is no reason to give another
    //scope

    function parseRootChannels() {
        //TODO?
        //this method duplicated the functionality of BodegaManager.connect
        //I don't know what's better, duplicated code or complex functionality?
        function makeRequest(path, fn) {
            var stringData =''
            http.get(path, function(remoteRes2) {
                console.log("Got response: " + remoteRes2.statusCode);
                remoteRes2.on('data', function(chunkData) {
                    stringData += chunkData.toString('utf8')
                }).on('end', function() {
                    fn(stringData);
                });
            }).on('error', function(e) {
                console.log("Got error: " + e.message);
            });
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

        function parseAssets(assets) {
            var assetArray = [];
            //TODO the pageId must go here
            for (assetIt in assets) {
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
            return assetArray;
        }

        //now iterate in the root channels
        for (it in rootChannels) {
            makeRequest(options('channel/' + rootChannels[it].id, null, true), function(data) {
                //we have more channels
                var r = JSON.parse(data, 'utf8');
                console.log(r)
                if (r.channels.length > 0) {
                    //so we have more channels, so lets think
                    //a bit. We want every channel to show its children
                    //in the ui, so lets make all of those children into
                    //subcategories

                    //create our array
                    rootChannels[it].subcategories = parseChildChannels(r.channels);
                    categoriesForJade.push([rootChannels[it].name, rootChannels[it].subcategories]);
                    //TODO we also need the data from the subcategories
                } else {
                    categoriesForJade.push(rootChannels[it].name);
                }

                //lets check if our rootChannel has also assets
                if (r.assets.length > 0) {
                    //now lets take those assets
                    rootChannels[it].assets = parseAssets(r.assets);
                    dataForJade.push([rootChannels[it].name, rootChannels[it].assets);
                }
            });
        }
    }
    res.json({
        a: "a"
    })
}

var requestUrl = function(req, res) {
    return options('channels', null, true);
}

module.exports.communicate = communicate;
module.exports.requestUrl = requestUrl;
