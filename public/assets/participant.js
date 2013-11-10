App.Participant = Ember.Object.extend({
    loadInfo: function() {
        var _this = this;
        return Ember.Deferred.promise(function (p) {
            p.resolve($.ajax({ url: "http://localhost:3001/json/participant/info" }).then(function(response) {
                var info = {
                    firstName: response.firstName,
                    lastName: response.lastName,
                    middleName: response.middleName,
                    email: response.email
                };
                _this.setProperties(info);
                return info;
            }));
        });
    }
});

App.Participant.reopenClass({
    updateInfo: function(firstName, lastName, email, middleName) {
        var query = '';
        query = firstName ? (query + 'firstName=' + firstName) + '&' : query;
        query = lastName ? (query + 'lastName=' + lastName) + '&' : query;
        query = email ? (query + 'email=' + email) + '&' : query;
        query = middleName ? (query + 'middleName=' + middleName) + '&' : query;
        $.ajax({ url: 'http://localhost:3001/json/participant/changeAccountDetails?' +query });
    },

    updatePassword: function(newPassword) {
        if (newPassword) {
            $.ajax({ url: 'http://localhost:3001/json/participant/changePassword?newPassword=' + newPassword });
        }
    }
});

