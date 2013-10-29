var ReceiptsRoute = Ember.Route.extend({
  model: function() {
    var store = this.get('container').lookup('store:main');
    return new Ember.RSVP.Promise(function(resolve) {
      resolve([store.createRecord("receipt", {id: 14, unicorn: 'member'}),store.createRecord("receipt", {id:22, unicorn: 'member'})])
    });
  }
});

export default ReceiptsRoute;