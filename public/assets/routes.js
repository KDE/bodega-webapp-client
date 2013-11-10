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
       return { channelId: model[0].id, page: 1, rootChannelId: 0 }
    }
});

