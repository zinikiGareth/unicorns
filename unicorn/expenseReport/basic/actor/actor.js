var PromiseObjectProxy = Ember.ObjectProxy.extend(Ember.PromiseProxyMixin);

var actor = Ember.Object.extend({
  client: "Ziniki Network",
  location: "Arlington, VA",
  figureTotal: function(){
    var envelopes = this.get('viewables').map(function(viewable){
      var rv = viewable.horn.envelopeReceipt.as();
      return rv;
    });

    var total = Ember.RSVP.all(envelopes).then(function(envelopes){
      return envelopes.reduce(function (accumulator, value) {
        return accumulator + Ember.get(value, 'amount');
      }, 0);
    });

    return PromiseObjectProxy.create({
      promise: total
    });
  }.property('viewables.@each.horn')
});

export default actor;
