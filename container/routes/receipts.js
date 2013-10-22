var ReceiptsRoute = Ember.Route.extend({
  model: function() {
    return new Ember.RSVP.Promise(function(resolve) { resolve([Ember.Object.create({id: 14}),Ember.Object.create({id:22})])});
  }
});

export default ReceiptsRoute;