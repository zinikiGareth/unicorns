var actor = Ember.Object.extend({
  actualTotal: 0,
  figureTotal: function() {
    var self = this;
    var promises = [];
    if (this.get('viewables')) {
      this.get('viewables').forEach(function (m) {
        var ep = m.horn.receipt.as();
        ep.then(function() { console.log("saw response"); });
        promises.push(ep);
      });
    }
    var ret = Ember.RSVP.all(promises).then(function (values) {
      var sum = 0;
      debugger;
      Em.A(values).forEach(function (v) {
        sum += v.amount;
      });
      self.set('actualTotal', sum);
    });
    console.log(ret);
    return ret;
  }.observes('viewables.@each.horn')
});

export default actor;