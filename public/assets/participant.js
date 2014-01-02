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
                if (response.error && response.error.type) {
                    _this.set('updatePaymentMethodError', response.error.type);
                }
            });
        }
    }
});

App.AccountPasswordComponent = Ember.Component.extend({
    classNames: ['form-horizontal'],
    tagName: 'form',
    updatePasswordRequested: false,
    passwordsAreDifferent: false,

    passwordInvalid: function(accountPassword, confirmAccountPassword) {
        var _this = this;
        if (accountPassword !== confirmAccountPassword) {
            _this.set('passwordsAreDifferent', true);
            return true;
        } else {
            _this.set('passwordsAreDifferent', false);
            return false;
        }
    },

    actions: {
        updateAccountPassword: function(accountPassword, confirmAccountPassword) {
            var _this = this;
            var invalidPassword = _this.passwordInvalid(accountPassword, confirmAccountPassword);

            if (!invalidPassword) {
                _this.set('updatePasswordRequested', true);
                App.ParticipantInfo.updatePassword(accountPassword).then(function(response) {
                    if (response.error && response.error.type) {
                        _this.set('updatePasswordError', response.error.type);
                    }
                });
            }
        }
    }
});

App.ParticipantPointsComponent = Ember.Component.extend({
    classNames: ['form-horizontal'],
    tagName: 'form',
    purchasePointsRequested: false,
    pointsTypeChoice: 500,
    validPoints: -1,
    invalidAmountPoints: false,
    pointsPrice: App.Participant.pointsPrice(),

    eventManager: Ember.Object.create({
        mouseEnter: function(event, view) {
            var otherValuePointsCheckbox = $("#otherValuePointsCheckbox");
            var pointsRadio = $('input[type="radio"]');

            otherValuePointsCheckbox.click(function() {
                pointsRadio.prop('checked', false);
            })

            pointsRadio.click(function() {
                otherValuePointsCheckbox.prop('checked', false);
            })
        }
    }),

    calculatePoints: function(otherPointsAmount, pointsAmount) {
        var _this = this;
        var validPoints = _this.get('validPoints');
        _this.get('pointsPrice').then(function(response) {
            var realPrice = response.USD;

            validPoints = pointsAmount > 0 ? pointsAmount : otherPointsAmount;
            _this.set('validPoints', validPoints);
            if (validPoints > 0) {
                _this.set('pointsCost', validPoints * realPrice);
            } else {
                _this.set('pointsCost', 'You must select a valid number of points');
            }
        });
    },

    actions: {
        purchasePoints: function(otherPointsAmount, pointsAmount) {
            var _this = this;
            var validPoints = _this.get('validPoints');

            validPoints = pointsAmount > 0 ? pointsAmount : otherPointsAmount;
            if (validPoints) {
                _this.set('purchasePointsRequested', true);
                _this.set('invalidAmountPoints', false);
                App.Participant.purchasePoints(validPoints).then(function(response) {
                    console.log(response)
                    if (response.error && response.error.type) {
                        _this.set('purchasePointsError', response.error.type);
                    }
                });
            } else {
                _this.set('invalidAmountPoints', true);
            }

            //After the purchase is being finished,
            //we are closing the modal manualy.
            $("#purchasePointsModal").modal('hide');
        },

        modalConfirm: function(otherPointsAmount, pointsAmount) {
            $("#purchasePointsModal").modal('show');

            var _this = this;
            _this.calculatePoints(otherPointsAmount, pointsAmount);
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
