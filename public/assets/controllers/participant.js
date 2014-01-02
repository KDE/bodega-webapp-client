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
