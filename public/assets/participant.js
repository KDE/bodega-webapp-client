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
                return info;
            }));
        });
    },
    loadHistory: function() {
        return Ember.Deferred.promise(function (p) {
            p.resolve($.ajax({ url: "http://localhost:3001/json/participant/history" }).then(function(response) {
                return response.history;
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
    },

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
                p.resolve($.ajax({ url: "http://localhost:3001/json/participant/changeAccountDetails?" + query }).then(function(response) {
                    return response;
                }));
            });
        }
    }
})

App.CreditCardComponent = Ember.Component.extend({
    classNames: ['form-horizontal'],
    tagName: 'form',
    cardExpMonthChoice: null,
    cardExpYearChoice: null,
    cardTypeChoice: null,
    cardNameInvalid: false,
    cardNumberInvalid: false,
    cardCvcInvalid: false,
    updatePaymentMethodRequested: false,

    cardExpMonthChoices: function() {
        var _this = this;
        var choice = Ember.A();
        $.map($(Array(12)),function(val, i) {
              choice.pushObject(i+1);
        })

        return choice;
    }.property(),

    cardExpYearChoices: function() {
        var _this = this;
        var choice = Ember.A();
        var date = new Date();
        var currentYear = date.getFullYear();
        $.map($(Array(30)),function(val, i) {
              choice.pushObject(i+currentYear);
        })

        return choice;
    }.property(),

    purchaseMethodMissing: function() {
        var _this = this;
        var error = _this.get('error');
        if (error && error.type) {
            console.log(error)
            return error.type === 'PurchaseMethodMissing';
        }
    }.property(),

    retrieveCardData: function() {
        var _this = this;
        var cardData = {
            'card': _this.get('cardTypeChoice'),
            'inputName': _this.get('cardName'),
            'inputNumber': _this.get('cardNumber'),
            'inputCvc': _this.get('cardCvc'),
            'inputMonthExpires': _this.get('cardExpMonthChoice'),
            'inputYearExpires': _this.get('cardExpYearChoice')
        };

        return cardData;
    },

    cardDataIsValid: function(cardData) {
        var _this = this;
        _this.set('cardNameInvalid', !/^[a-z]|[A-Z]+/i.test(cardData['card[name]']));
        _this.set('cardNumberInvalid', !/^[0-9]+$/i.test(cardData['card[number]']));
        _this.set('cardCvcInvalid', !/^[0-9]+$/i.test(cardData['card[cvc]']));
    },

    actions: {
        updatePaymentMethod: function() {
            var _this = this;
            var cardData = _this.retrieveCardData();
            _this.cardDataIsValid(cardData);
            _this.set('updatePaymentMethodRequested', true);
            App.ParticipantPaymentMethod.updatePaymentMethod(cardData).then(function(response) {
                console.log(response)
                if (response.error && response.error.type) {
                    _this.set('updatePaymentMethodError', response.error.type);
                }
            });
        }
    }
});


