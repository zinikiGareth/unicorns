import Oasis from 'oasis';

var list = Ember.Component.extend({
  viewables: Em.A(),
  
  init: function() {
    var self = this;
    this._super();
    App.UnicornLib.coordinator.register('archetype', Ember.guidFor(this));
    var unicorns = this.get('hearts');
    unicorns.addArrayObserver({
      arrayWillChange: function() {
      },
      arrayDidChange: function(arr, start, remove, add) {
        for (var i=start;i<start+remove;i++) {
          self.viewables.removeObject(self.viewables[i]);
        }
        for (var i=0;i<add;i++) {
          var added = arr[start+i];
          self.addBoxFor(start+i, added);
        }
      }
    });
    var j=0;
    unicorns.forEach(function (p) {
      self.addBoxFor(j, p);
      j++;
    });
  },
  
  // Because of all the asynchronity, we stand a good chance of not putting things
  // in the place that we really want them.
  // But this is a specific instance of a general collision problem, so ultimately we
  // should replace this with some kind of "markerArray"
  // To make matters worse, I am using "addObject" which doesn't seem to have an index,
  // but unlike "splice" does invoke the observers.  Presumably there is some Ember.Array method
  // that adds things at an index, but I'm not seeing it in the doc.
  // If we ever do need a short-term hack, we should just make sure that "viewables" is in
  // the same order as "hearts" :-)
  addBoxFor: function(pos, unicorn) {
    var self = this;
    var container = this.get('container');
    
    App.UnicornLib.util.embody(container, this.get('mode'), unicorn, Ember.guidFor(this)).then(function(viewable) {
      self.viewables.addObject(viewable);
    });
  },
  
  removeItem: function(itemId) {
    console.log("Asked to remove item", itemId);
    var unicorns = this.get('hearts');
    console.log(unicorns.get('length'));
    unicorns.forEach(function (u) {
      if (u.get('id') == itemId)
        unicorns.removeObject(u);
    });
    console.log(unicorns.get('length'));
  }
});

export default list;