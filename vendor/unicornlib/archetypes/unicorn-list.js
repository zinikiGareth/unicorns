import Oasis from 'oasis';

var list = Ember.Component.extend({
  viewables: Em.A(),
  store: null,
  
  init: function() {
    var self = this;
    this._super();
    this.store = this.container.lookup('store:main');
    var unicorns = this.get('hearts');
    unicorns.addArrayObserver({
      arrayWillChange: function() {
      },
      arrayDidChange: function(arr, start, remove, add) {
        for (var i=0;i<add;i++) {
          var added = arr.objectAt(start+i);
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
  // If we ever do need a short-term hack, we should just make sure that "viewables" is in
  // the same order as "hearts" :-)
  addBoxFor: function(pos, unicorn) {
    var viewables = this.viewables;

    App.UnicornLib.util.embody(this.container, this.get('mode'), unicorn).then(function(viewable) {
      viewables.insertAt(pos, viewable);
    });
  },
  
  // In order for "drop" to happen, we need to
  // prevent default dragOver behavior.
  dragOver: function(ev) {
//    console.log("drag overed: ", ev);
    ev.preventDefault();
  },
//  
//  mouseMove: function(ev) {
//    console.log("mouse move: ", ev);
//    ev.preventDefault();
//  },
  
//  dragEnter: function(ev) {
//    console.log("drag entered: ", ev);
//  },
  
  drop: function(ev) {
    console.log("dropped: ", ev);
    var hearts = this.get('hearts');
    // This comes back as just the "ID" of the heart
    // We need to get the actual model from the store
    // BETTER: we reflect this event up to the actual application
    // and looks up the object
    // How do we know where we pulled it from?
    var dragData = JSON.parse(ev.dataTransfer.getData('unicornHeart'));
    var record = this.store.find('receipt', dragData.id).then(function (r) {
      hearts.addObject(r);
    });
  }
});

export default list;
