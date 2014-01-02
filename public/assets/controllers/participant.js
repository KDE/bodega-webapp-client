App.ParticipantInfoController = Ember.ObjectController.extend({
    updateInfoRequested: false,

    actions: {
        updateAccountInfo: function(accountData) {
            var _this = this;
            _this.set('updateInfoRequested', true);

            App.ParticipantInfo.updateInfo(accountData.firstName, accountData.lastName, accountData.email, accountData.middleNames).then(function(response) {
                if (response.error && response.error.type) {
                    _this.set('updateInfoError', response.error.type);
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

