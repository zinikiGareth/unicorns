var UnicornProxyThinger = Ember.ObjectProxy.extend(Ember.PromiseProxyMixin);

var actor = Ember.Object.extend({
  figureTotal: function(){
    var envolopes = this.get('viewables').map(function(viewable){
      return viewable.horn.receipt.as();
    });

    var total = Ember.RSVP.all(envolopes).then(function(envolopes){
      return values.reduce(function (accumulator, value) {
        return accumulator + value;
      }, 0);
    });

    return UnicornProxyThinger.create({
      promise: total
    });
  }.property('viewables.@each.horn')
});

export default actor;
