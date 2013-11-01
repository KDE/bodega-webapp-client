App = Ember.Application.create({
    LOG_TRANSITIONS: true,//, // basic logging of successful transitions
    LOG_TRANSITIONS_INTERNAL: true // detailed logging of all routing steps;
})

App.Router.map(function() {
  // put your routes here
  this.resource('mainPage', { path: '/mainPage/:channelId/:page' });
});

App.ChannelList = Ember.Object.extend({
    hasLoadedChannels: false,

    findAllChannels: function() {
        var _this = this;
        return Ember.Deferred.promise(function (p) {
            if (_this.get('hasLoadedChannels')) {
                //we have already load our channels
                p.resolve(channels.get('channelList'));
            } else {
                p.resolve($.ajax({url: "http://localhost:3001/json/channels"}).then(function(response) {
                    var list = Ember.A();
                    response.channels.forEach(function(ch) {
                        var channel = App.Channel.create(ch);
                        channel.loadChannel(ch.id);
                        list.pushObject(channel);
                        _this.setProperties({channelList: list, hasLoadedChannels: true});
                    });
                    return list;
                }));
            }
        });
    }
});

App.Channel = Ember.Object.extend({
    hasLoadedChannel: false,
    loadChannel: function(channelId) {
        var _this = this;
        return Ember.Deferred.promise(function (p) {
            if (_this.get('hasLoadedChannel')) {
                p.resolve(channels.get('channelData'));
            } else {
                p.resolve($.ajax({url: "http://localhost:3001/json/channel/" + channelId}).then(function(response) {
                    var channelData = Ember.A();

                    channelData.pushObject(App.Channel.create({assets: response.assets, childChannels: response.channels}));
                    _this.setProperties({channelData: channelData, hasLoadedChannel: true});
                    return channelData;
                }));
            }
        });
    }
});

App.IndexRoute = Ember.Route.extend({
    redirect: function() {
        this.transitionTo('mainPage');

    }
});

App.MainPageRoute = Ember.Route.extend({
    model: function() {
        return App.ChannelList.create().findAllChannels();
    },
    serialize: function(model) {
       return {channelId: model[0].id, page: 1}
    }
});


