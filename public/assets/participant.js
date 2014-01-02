App.Participant = Ember.Object.extend({
});

App.Participant.reopenClass({
    purchaseAsset: function(assetId) {
        if (assetId > 0) {
            return Ember.Deferred.promise(function (p) {
                p.resolve( $.ajax({url: 'http://localhost:3001/json/purchase/' + assetId }).then(function(response) {
                    return response;
                }));
            });
        } else {
            console.log('assetId' + assetId + 'doesn\'t exists!');
        }
    },

    pointsPrice: function() {
        return Ember.Deferred.promise(function (p) {
            p.resolve( $.ajax({url: 'http://localhost:3001/json/points/price' }).then(function(response) {
                return response;
            }));
        });
    },

    purchasePoints: function(pointsAmount) {
        if (pointsAmount > 0) {
            var pointsAmountData = {
                'amount': pointsAmount
            };

            return Ember.Deferred.promise(function (p) {
                p.resolve( $.ajax({
                    url: 'http://localhost:3001/json/points/buy',
                    type: "POST",
                    dataType: "json",
                    data: pointsAmountData
                }).then(function(response) {
                    return response;
                }));
            });
        } else {
            console.log('pointsAmount is less that 0. PointsAmount: ' + pointsAmount);
        }
    },

});

App.ParticipantInfo = Ember.Object.extend({
    loadInfo: function() {
        var _this = this;
        return Ember.Deferred.promise(function (p) {
            p.resolve($.ajax({ url: "http://localhost:3001/json/participant/info" }).then(function(response) {
                var info = {
                    firstName: response.firstName,
                    lastName: response.lastName,
                    middleNames: response.middleNames,
                    email: response.email
                };
                return info;
            }));
        });
    }
});

App.ParticipantInfo.reopenClass({
    updateInfo: function(firstName, lastName, email, middleNames) {

        return Ember.Deferred.promise(function (p) {
            var query = {
                'firstName': firstName,
                'lastName': lastName,
                'email': email,
                'middleNames': middleNames
            };
            p.resolve($.ajax({
                url: "http://localhost:3001/json/participant/changeAccountDetails" ,
                type:"POST",
                dataType: "json",
                data: query
            }).then(function(response) {
                return response;
            }));
        });
    },

    updatePassword: function(newPassword) {
        if (newPassword) {
            return Ember.Deferred.promise(function(p) {
                p.resolve($.ajax({ url: "http://localhost:3001/json/participant/changePassword?newPassword=" + newPassword }).then(function(response) {
                    return response;
                }));
            });
        }
    }
});

App.ParticipantPaymentMethod = Ember.Object.extend({
    loadPaymentMethod: function() {
        var _this = this;
        return Ember.Deferred.promise(function (p) {
            p.resolve($.ajax({ url: "http://localhost:3001/json/participant/paymentMethod" }).then(function(response) {
                return response;
            }));
        });
    }
});

App.ParticipantPaymentMethod.reopenClass({
    updatePaymentMethod: function(cardData) {
        if (cardData) {
            var query = {
                "card[type]": cardData.card,
                "card[name]": cardData.inputName,
                "card[number]": cardData.inputNumber,
                "card[cvc]": cardData.inputCvc,
                "card[exp_month]": cardData.inputMonthExpires,
                "card[exp_year]": cardData.inputYearExpires
            };

            return Ember.Deferred.promise(function (p) {
                p.resolve($.ajax({
                    url: "http://localhost:3001/json/participant/changeAccountDetails",
                    type: "POST",
                    dataType: "json",
                    data: query
                }).then(function(response) {
                    return response;
                }));
            });
        }
    }
});

App.ParticipantHistory = Ember.Object.extend({
    localeDate: function() {
        var date = new Date(this.get('date'));
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    }.property('date')
});

App.ParticipantHistory.reopenClass({
    retrieveHistoryData: function() {
        return Ember.Deferred.promise(function (p) {
            p.resolve($.ajax({ url: "http://localhost:3001/json/participant/history" }).then(function(response) {
                return response;
            }));
        });
    }
});
