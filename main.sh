#!/bin/sh
case "$1" in
    "production" ) forever start -a -l bodega-webapp-production.log -o bodega-webapp-production-out.log -e bodega-webapp-production-error.log app.js;;
               * ) NODE_ENV=development node app.js;;
esac
