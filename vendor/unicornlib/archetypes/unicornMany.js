import Oasis from 'oasis';

var many = Ember.Component.extend({
  viewables: Em.A(),
  store: null,
  
  init: function() {
    var self = this;
    this._super();
    App.UnicornLib.coordinator.register('archetype', Ember.guidFor(this));
    this.store = this.container.lookup('store:main');
    var mixes = this.get('mixes');
    if (!mixes)
      mixes = Em.A();
    mixes.addArrayObserver({
      arrayWillChange: function() {
      },
      arrayDidChange: function(arr, start, remove, add) {
        for (var i=start;i<start+remove;i++) {
          self.viewables.removeObject(self.viewables[i]);
        }
        for (var i=0;i<add;i++) {
          var added = arr.objectAt(start+i);
          self.addBoxFor(start+i, added);
        }
      }
    });
    var j=0;
    mixes.forEach(function (p) {
      self.addBoxFor(j, p);
      j++;
    });
  },
  
  // Because of all the asynchronity, we stand a good chance of not putting things
  // in the place that we really want them.
  // But this is a specific instance of a general collision problem, so ultimately we
  // should replace this with some kind of "markerArray"
  // If we ever do need a short-term hack, we should just make sure that "viewables" is in
  // the same order as "hearts" :-)
  addBoxFor: function(pos, unicorn) {
    var viewables = this.viewables;

    App.UnicornLib.util.embody(this.container, this.get('mode'), unicorn, Ember.guidFor(this)).then(function(viewable) {
      viewables.insertAt(pos, viewable);
    });
  },
  
  // In order for "drop" to happen, we need to
  // prevent default dragOver behavior.
  dragOver: function(ev) {
    // TODO: I suspect that we need to add in more cunning here to determine if we are, or are not,
    // a valid drop zone for this packet
    ev.preventDefault();
  },
  
  drop: function(ev) {
    var dragData = JSON.parse(ev.dataTransfer.getData('unicornHeart'));
    App.UnicornLib.coordinator.dragItem(dragData.model, dragData.id, dragData.from, Ember.guidFor(this));
  },
  
  addItem: function(type, itemId) {
    var unicorns = this.get('hearts');
    var record = this.store.find(type, itemId).then(function (r) {
      unicorns.addObject(r);
    });
  },
  
  removeItem: function(itemId) {
    var unicorns = this.get('hearts');
    var toRemove;
    unicorns.forEach(function (u) {
      if (u.get('id') == itemId)
        toRemove = u;
    });
    if (toRemove)
      unicorns.removeObject(toRemove);
  }
});

export default many;
