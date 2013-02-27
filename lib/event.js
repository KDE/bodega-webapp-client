var util = require("util");
var events = require("events");

var EventHandler = function() {
    events.EventEmitter.call(this);
}

util.inherits(EventHandler, events.EventEmitter);

EventHandler.prototype.takeDataForParticipantInfo = function(req, res) {
    this.emit('takeDataForParticipantInfo', req, res);
}

module.exports.EventHandler = EventHandler;
