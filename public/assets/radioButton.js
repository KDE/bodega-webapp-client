//Until now the Ember.js doesn't offer support for RadioButton,
//so we are using an implemantation which already exists until this
//issue is being fixed.

Ember.RadioButton = Ember.View.extend({
    tagName : "input",
    type : "radio",
    attributeBindings : [ "name", "type", "value", "checked:checked:" ],
    click : function() {
        this.set("selection", this.$().val())
    },
    checked : function() {
        return this.get("value") == this.get("selection");
    }.property()
});

