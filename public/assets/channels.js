App.ChannelList = Ember.Object.extend({
    hasLoadedChannels: false,
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
                        channel.set('pageId', params.page);
                        channel.set('rootChannelId', params.rootChannelId);
                        channel.set('currentChannelId', params.channelId);
                        if (!params.channelId && !params.page && i === 0) {
                            // load only the first channel
                            channel.loadChannel(0, channel.get('id'));
                            console.log('Use the default channel');
                        }
                        var requestedChannelId = params.rootChannelId != 0 ? params.rootChannelId : params.channelId;
                        if (requestedChannelId == channel.get('id')) {
                            // this is a sub channel
                            console.log('Load the channel')
                            channel.loadChannel(params.channelId, params.channelId)
                        }
                        list.pushObject(channel);
                    }
                    return list;
                }));
            }
        });
    }
});

App.Channel = Ember.Object.extend({
    hasLoadedChannel: false,
    assets: [],
    loadChannel: function(requestedChannelId, currentChannelId) {
        var _this = this;
        var subChannels= [];
        return Ember.Deferred.promise(function (p) {
            // TODO its not being called!
            if (_this.get('hasLoadedChannel')) {
                console.log('Channel has already been loaded')
                p.resolve(_this);
            } else {
                // FIXME remove hardcoded 24
                var page = _this.get('pageId');
                var offset = (page > 1) ? ((page - 1) * 24) : 0;
                p.resolve($.ajax({ url: "http://localhost:3001/json/channel/" + _this.get('id') +'?offset='+ offset }).then(function(response) {
                    // now lets take the assets
                    _this.set('assets', response.assets);

                    console.log('The channel with id ' + _this.get('id') + ' and name ' + _this.get('name') +' has the ' + _this.get('assets').length + ' assets');
                    console.log(response.assets)
                    // a channel may have a subchannel so lets check
                    if (response.channels.length > 0) {
                        // ok we have one or more subChannels and we haven't found the
                        // requested channel so lets fetch them
                        response.channels.forEach(function(item) {
                            var subChannel = App.Channel.create(item);
                            subChannel.set("pageId", page);
                            subChannel.set("rootChannelId", _this.get('id'));
                            subChannel.set('currentChannelId', currentChannelId);
                            if (_this.get('id') != requestedChannelId) {
                                console.log('Parse the subchannels')
                                subChannel.loadChannel(0);
                            }
                            console.log("these are the subchannels " + JSON.stringify(item))
                            subChannels.pushObject(subChannel);
                        });
                    }
                    _this.set("subChannels", subChannels)
                    _this.setProperties({ hasLoadedChannel: true });
                    return _this;
                }));
            }
        });
    }
});

App.ChannelDataComponent = Ember.Component.extend({
    tagName: 'li',
    classNameBindings: ['isExpanded:expand'],
    isExpanded:  function() {
        var _this = this;
        var data = _this.get('data');

        if (data.rootChannelId == 0) {
            return true;
        } else if (data.rootChannelId == data.id) {
            return true;
        } else if (data.id == data.currentChannelId) {
            return true;
        } else {
            return false;
        }
    }.property()
});

App.ParentChannelsComponent = Ember.Component.extend({
    tagName: 'li'
});

App.SubChannelsComponent = Ember.Component.extend({
    tagName: 'ul',
    classNames: ['nav', 'nav-list' ]
});

App.ChannelsListComponent = Ember.Component.extend({
    tagName: 'ul',
    classNames: [ 'bs-sidebar','nav', 'nav-list', 'affix' ]
});

App.AssetThumbnailComponent = Ember.Component.extend({
    tagName: 'li',
    classNames: ['span4'],
    modalId: function() {
        var _this = this;
        var data = _this.get('data');
        return 'modal_id' + data.id;
    }.property()
});

App.AssetModalComponent = Ember.Component.extend({
    classNames: ['modal', 'hide', 'fade'],
    attributeBindings: ['id', 'tabindex', 'role', 'align'],
    tabindex: -1,
    role: 'dialog',
    align: 'center'
});
