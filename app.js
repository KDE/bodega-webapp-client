
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var fs = require('fs');

var app = module.exports= express();

GLOBAL.app = app;

app.config = JSON.parse(fs.readFileSync(('./config.json'), 'utf8'));

app.configure(function() {
    app.set('port', process.env.PORT || 3300);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());

    //app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));

    app.use(function(req, res, next) {
        res.render('404.jade', {});
    });

});

// We don't want an exception to kill our app, but we don't want
//   to intercept exception in tests or during dev testing
if (app.settings.env === 'production') {
    process.on('uncaughtException', function(err) {
        console.log("Uncaught exception: ");
        console.log(err);
        console.log(err.stack);
    });
}

app.configure('development', function() {
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('test', function() {
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function() {
    app.use(express.errorHandler());
});


var bodega = require('./lib/bodega.js').BodegaManager;
var BodegaManager = new bodega();
app.BodegaManager = BodegaManager;

require("./routes.js");

http.createServer(app).listen(app.get('port'), function() {
  console.log("Bodega web application client listening on port " + app.get('port'));
});
