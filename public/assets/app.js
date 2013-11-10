App = Ember.Application.create({
    LOG_TRANSITIONS: true,//, // basic logging of successful transitions
    LOG_TRANSITIONS_INTERNAL: true // detailed logging of all routing steps;
})

App.Router.map(function() {
  // put your routes here
  this.resource('mainPage', { path: '/mainPage/:channelId/:page/:rootChannelId' });
});

