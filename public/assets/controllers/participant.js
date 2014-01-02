App.ParticipantInfoController = Ember.ObjectController.extend({
    updateInfoRequested: false,
    updatePasswordRequested: false,
    passwordsAreDifferent: false,

    actions: {
        updateAccountInfo: function(accountData) {
            var _this = this;
            _this.set('updateInfoRequested', true);

            App.ParticipantInfo.updateInfo(accountData.firstName, accountData.lastName, accountData.email, accountData.middleNames).then(function(response) {
                if (response.error && response.error.type) {
                    _this.set('updateInfoError', response.error.type);
                }
            });
        },

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
    },

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
});

App.ParticipantPointsController = Ember.ObjectController.extend({
    purchasePointsRequested: false,
    pointsTypeChoice: 500,
    validPoints: -1,
    invalidAmountPoints: false,
    pointsPrice: App.Participant.pointsPrice(),

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

App.ParticipantPaymentMethodController = Ember.ObjectController.extend({
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
        try {
            check(cardData['inputName']).isAlpha();
            this.set('cardNameInvalid', false);
        } catch (e) {
            this.set('cardNameInvalid', true)
        }

        try {
            check(cardData['inputNumber']).isInt();
            this.set('cardNumberInvalid', false);
        } catch (e) {
            this.set('cardNumberInvalid', true)
        }

        try {
            check(cardData['inputCvc']).isInt();
            this.set('cardCvcInvalid', false);
        } catch (e) {
            this.set('cardCvcInvalid', true)
        }

    },

    actions: {
        updatePaymentMethod: function() {
            var _this = this;
            var cardData = _this.retrieveCardData();
            _this.cardDataIsValid(cardData);
            console.log(cardData)
            _this.set('updatePaymentMethodRequested', true);
            App.ParticipantPaymentMethod.updatePaymentMethod(cardData).then(function(response) {
                if (response.error && response.error.type) {
                    _this.set('updatePaymentMethodError', response.error.type);
                }
            });
        }
    }
});

