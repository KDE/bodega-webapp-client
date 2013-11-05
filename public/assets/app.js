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
    channelList: [],
    findAllChannels: function(params) {
        var _this = this;
        return Ember.Deferred.promise(function (p) {
            if (_this.get('hasLoadedChannels')) {
                // TODO its not being called!
                // we have already loaded our channels
                console.log('We have already loaded the ChannelList');
                p.resolve(channels.get('channelList'));
            } else {
                p.resolve($.ajax({ url: "http://localhost:3001/json/channels" }).then(function(response) {
                    var list = Ember.A();
                    for (var i = 0; i < response.channels.length; i++) {
                        var channel = App.Channel.create(response.channels[i]);
                        if (!params.channelId && !params.page && i === 0) {
                            // load only the first channel
                            channel.loadChannel(0);
                            console.log('Use the default channel');
                        } else {
                            channel.loadChannel(params.page)
                            console.log('Load a specific channel')
                        }
                        list.pushObject(channel);
                    }
                    _this.setProperties({channelList: list, hasLoadedChannels: true});
                    return list;
                }));
            }
        });
    }
});

App.Channel = Ember.Object.extend({
    hasLoadedChannel: false,
    assets: [],
    subChannels: [],
    loadChannel: function(page) {
        var _this = this;
        return Ember.Deferred.promise(function (p) {
            // TODO its not being called!
            if (_this.get('hasLoadedChannel')) {
                console.log('Channel has already been loaded')
                p.resolve(_this);
            } else {
                // FIXME remove hardcoded 24
                var offset = (page > 1) ? ((page - 1) * 24) : 0;
                p.resolve($.ajax({ url: "http://localhost:3001/json/channel/" + _this.get('id') +'?offset='+ offset }).then(function(response) {
                    // now lets take the assets
                    _this.set('assets', response.assets);

                    console.log('The channel with id ' + _this.get('id') + ' and name ' + _this.get('name') +' has the ' + _this.get('assets').length + ' assets');
                    // a channel may have a subchannel so lets check
                    if (response.channels.length > 0) {
                        // ok we have one or more subChannels so lets fetch them
                        response.channels.forEach(function(item) {
                            console.log('Parse the subchannels')
                            var subChannel = App.Channel.create(item);
                            subChannel.loadChannel(0);
                            _this.subChannels.pushObject(subChannel);
                        });
                    }
                    _this.setProperties({ hasLoadedChannel: true });
                    return _this;
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
    model: function(params) {
        return App.ChannelList.create().findAllChannels(params);
    },
    serialize: function(model, params) {
       return {channelId: model[0].id, page: 1}
    }
});


