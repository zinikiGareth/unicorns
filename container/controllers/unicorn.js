var UnicornController = Ember.ObjectController.extend({
  content: function() {
    console.log("Getting model");
    return this._super();
  }
});

export default UnicornController;