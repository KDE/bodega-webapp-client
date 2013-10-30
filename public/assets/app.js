App = Ember.Application.create({
    LOG_TRANSITIONS: true, // basic logging of successful transitions
  //  LOG_TRANSITIONS_INTERNAL: true, // detailed logging of all routing steps;
    PREVIOUS_JSON: {}
})

App.Router.map(function() {
  // put your routes here
  this.resource('channels', { path: '/channels' }, function() {
    this.resource('channel', { path: '/channel/:channel_id'})
  });
});

App.Channels = Ember.Object.extend({
    loadedChannel: false,

    loadChannels: function() {
        var channels = this;
        return Ember.Deferred.promise(function (p) {
            if (channels.get('loadedChannel')) {
                //we have already load our channels
                p.resolve(channels.get('channelList'));
            } else {
                p.resolve($.ajax({url: "http://localhost:3001/json/KDE-1/channels"}).then(function(response) {
                    var channelList = Ember.A();
                    if (response.channels.length > 0) {
                        //App.PREVIOUS_JSON = response;
                    }
                    response.channels.forEach(function(ch) {
                        channelList.pushObject(App.Channel.create(ch));
                        channels.setProperties({channelList: channelList, loadedChannel: true});
                    });
                    return channelList;
                }));
            }
        });
    }
});

App.Channel = Ember.Object.extend({
    loadedChannel: false,
    loadChannel: function(channel_id) {
        var channels = this;
        return Ember.Deferred.promise(function (p) {
            if (channels.get('loadedChannel')) {
                p.resolve(channels.get('channelData'));
            } else {
                p.resolve($.ajax({url: "http://localhost:3001/json/KDE-1/channel/"+ channel_id}).then(function(response) {
                    var channelData = Ember.A();
                    if (response.channels.length > 0) {
                        App.PREVIOUS_JSON = response;
                        channelData.pushObject(App.Channel.create({jsonAssets: response.assets, jsonChannels: response.channels}));
                    } else {
                        channelData.pushObject(App.Channel.create({jsonAssets: response.assets, jsonChannels: App.PREVIOUS_JSON.channels}));
                    }
                        channels.setProperties({channelData: channelData, loadedChannel: true});
                    return channelData;
                }));
            }
        });
    },

    availableAssets: function() {
        return this.get('jsonAssets');
    }.property('jsonAssets'),

    availableChannels: function() {
        return this.get('jsonChannels');
    }.property(),
});

App.ChannelsRoute = Ember.Route.extend({
    model: function() {
        return App.Channels.create().loadChannels();
    }
});

App.ChannelRoute = Ember.Route.extend({
    model: function(params) {
        return App.Channel.create().loadChannel(params.channel_id);
    },

    setupController: function(controller, model) {
        controller.controllerFor('channels').set('subChannels',model)
    }
});

App.IndexRoute = Ember.Route.extend({
    redirect: function() {
        this.transitionTo('channels');
    }
});

