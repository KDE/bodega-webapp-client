var options = require('./utils.js').options
var http = require('http');

var communicate = function(req, res, remoteRes, chunk) {

    var reply = JSON.parse(chunk.toString('utf8'), 'utf8');
    console.log(reply)

    //like wallpapers and books
    var rootChannels = [];

    //take all the root channels
    for(i in reply.channels) {
        var temp = {
            id: i.id,
            name: i.name,
            description: i.description,
            image: i.image
        }
        rootChannels.push(temp);
    }

    var isHomeIndex = false;
    if (req.param.category === undefined &&
        req.param.subcategory === undefined &&
        req.param.pageId === undefined) {
        //the user has requested a url like
        //sample.org/index
        isHomeIndex = true;
    }

    parseRootChannels(isHomeIndex);

    //below you will see that I define some methods
    //inside this method, in js this is valid and also
    //it limits the scope of those methods. We want to use those methods
    //only in this method(communicate) so there is no reason to give another
    //scope

    function parseRootChannels(isHomeIndex) {

        //TODO?
        //this method duplicated the functionality of BodegaManager.connect
        //I don't know what's better, duplicated code or complex functionality?
        function makeRequest(path, fn) {
            http.get(path, function(remoteRes2) {
                console.log("Got response: " + remoteRes2.statusCode);
                remoteRes.on('data', function(c) {
                    var reply2 = JSON.parse(c.toString('utf8'), 'utf8');
                    fn(reply);
                });
            }).on('error', function(e) {
                console.log("Got error: " + e.message);
            });
        }

        function parseChildChannels(childrenChannels) {
            parentSubcategoryArray = [];
            for (child in childrenChannels) {
                subcategory = {
                    id: child.id,
                    name: child.name,
                    description: child.description,
                    image: child.image //TODO  it may be null
                };
                parentSubcategoryArray.push(subcategory);
            }
            return parentSubcategoryArray;
        }

        function parseAssets(assets) {
            var assetArray = [];
            for (assetIt in r.assets) {
                asset = {
                    id: assetIt.id,
                    name: assetIt.name,
                    version: assetIt.version,
                    license: assetIt.license,
                    image: assetIt.image
                };
                assetArray.push(asset);
            }
            return assetArray;
        }

        //now iterate in the root channels
        for (it in rootChannels) {
            makeRequest(options('channel/' + it.id), function(r) {
                //we have more channels
                if (r.channels > 0) {
                    //so we have more channels, so lets think
                    //a bit. We want every channel to show its children
                    //in the ui, so lets make all of those children into
                    //subcategories

                    //create our array
                    rootChannels[it].subcategories = parseChildChannels(r.channels);

                    //TODO we also need the data from the subcategories
                }

                //lets check if our rootChannel has also assets
                if (r.assets > 0) {
                    //now lets take those assets
                    rootChannels[it].assets = parseAssets(r.assets);
                }
            });
        }
    }
}

var requestUrl = function(req, res) {
    var query = {};
    return options('channels', query, true);
}

module.exports.communicate = communicate;
module.exports.requestUrl = requestUrl;
