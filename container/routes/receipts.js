var ReceiptsRoute = Ember.Route.extend({
  model: function() {
    var store = this.get('container').lookup('store:main');
    return new Ember.RSVP.Promise(function(resolve) {
      resolve([store.createRecord("receipt", {id: 14}),store.createRecord("receipt", {id:22})])
    });
  }
});

export default ReceiptsRoute;