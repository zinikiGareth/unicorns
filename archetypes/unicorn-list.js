var list = Ember.Component.extend({
  boxes: Em.A(),
  
  init: function() {
    var self = this;
    this._super();
    this.get('unicorns').addArrayObserver({
      arrayWillChange: function() {
        console.log("Will", arguments);
      },
      arrayDidChange: function(arr, start, remove, add) {
        for (var i=0;i<add;i++) {
          var added = arr[start+i];
          self.addBoxFor(start+i, added);
        }
      }
    });
    var unicorns = this.get('unicorns');
    for (var i=0;i<unicorns.length;i++)
      this.addBoxFor(i, unicorns.objectAt(i));
  },
  
  addBoxFor: function(pos, unicorn) {
    var self = this;
    // TODO: resolve promise, add then("add to boxes");
    console.log("added", pos, unicorn);
    console.log(unicorn instanceof Ember.RSVP.Promise);
    if (unicorn instanceof Ember.RSVP.Promise) {
      unicorn.then(function(resolved) { self.addBoxFor(pos, resolved); });
      return;
    }
  }
});

export default list;