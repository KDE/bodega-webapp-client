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

App.ParticipantRoute = Ember.Route.extend({
    model: function(params) {
        return App.Participant.create().loadInfo();
    }
});

App.ParticipantInfoRoute = Ember.Route.extend({
    model: function(params) {
        return App.ParticipantInfo.create().loadInfo();
    }
});

App.ParticipantPaymentMethodRoute = Ember.Route.extend({
    model: function(params) {
        return App.ParticipantPaymentMethod.create().loadPaymentMethod();
    }
});

App.ParticipantHistoryRoute = Ember.Route.extend({
    model: function(params) {
        return App.ParticipantHistory.retrieveHistoryData().then(function(data) {
            var result = [];
            data.history.forEach(function(item) {
                result.push(App.ParticipantHistory.create(item));
            });

            return result;
        });
    }
});

App.ParticipantPointsRoute = Ember.Route.extend({
    //We don't need to load any information in order to
    //purchase some points. But we are creating an empty model
    //because it is being required by emberjs.
    model: function(params) {
        return [];
    }
});

