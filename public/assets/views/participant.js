App.ParticipantPointsView = Ember.View.extend({
    eventManager: Ember.Object.create({
        mouseEnter: function(event, view) {
            //On our form we prove two methods of purchasing points.
            //the first one is a radio group and the second one is a
            //an input field where the desired amount will be field in.
            //So the following jquery code unchecks the radio group
            //if the input field has a number inside and the other way around.
            var otherValuePointsCheckbox = $("#otherValuePointsCheckbox");
            var pointsRadio = $('input[type="radio"]');

            otherValuePointsCheckbox.click(function() {
                pointsRadio.prop('checked', false);
            })

            pointsRadio.click(function() {
                otherValuePointsCheckbox.prop('checked', false);
            })
        }
    })
});
