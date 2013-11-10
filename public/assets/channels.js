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
                            channel.loadChannel(0, channel.get('id'));
                            console.log('Use the default channel');
                        }
                        var requestedChannelId = params.rootChannelId != 0 ? params.rootChannelId : params.channelId;
                        if (requestedChannelId == channel.get('id')) {
                            // this is a sub channel
                            console.log('Load the channel')
                            channel.loadChannel(params.page, params.channelId)
                        }
                        list.pushObject(channel);
                    }
                    _this.setProperties({ channelList: list, hasLoadedChannels: true });
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
    loadChannel: function(page, requestedChannelId) {
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
                    if (response.channels.length > 0 && _this.get('id') != requestedChannelId) {
                        // ok we have one or more subChannels and we haven't found the
                        // requested channel so lets fetch them
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

