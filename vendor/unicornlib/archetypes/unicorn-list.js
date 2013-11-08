import Oasis from 'oasis';
import UnicornLib from 'unicornlib/unicornlib';

var list = Ember.Component.extend({
  viewables: Em.A(),
  
  init: function() {
    var self = this;
    this._super();
    var unicorns = this.get('hearts');
    unicorns.addArrayObserver({
      arrayWillChange: function() {
      },
      arrayDidChange: function(arr, start, remove, add) {
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
  // If we ever do need a short-term hack, we should just make sure that "viewables" is in
  // the same order as "hearts" :-)
  addBoxFor: function(pos, unicorn) {
    var viewables = this.viewables;

    UnicornLib.Util.embody(this.container, this.get('mode'), unicorn).then(function(viewable) {
      viewables.insertAt(pos, viewable);
    });
  }
});

export default list;
