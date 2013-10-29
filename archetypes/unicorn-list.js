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
  
  // Because of all the asynchronity, we stand a good chance of not putting things
  // in the place that we really want them.
  // But this is a specific instance of a general collision problem, so ultimately we
  // should replace this with some kind of "markerArray"
  // To make matters worse, I am using "addObject" which doesn't seem to have an index,
  // but unlike "splice" does invoke the observers.  Presumably there is some Ember.Array method
  // that adds things at an index, but I'm not seeing it in the doc.
  addBoxFor: function(pos, unicorn) {
    var self = this;
    var container = this.get('container');
    
    // resolve promise (if any)
    if (unicorn instanceof Ember.RSVP.Promise) {
      unicorn.then(function(resolved) { self.addBoxFor(pos, resolved); });
      return;
    }

    // add to list of boxes for rendering
    if (this.get('mode') == 'goring') {
      var name = unicorn.get('unicorn');
      var goring = container.lookup("unicorn:" + name);
      goring.promise.then(function(code) {
        code.render(unicorn).then(function(view) {
          self.boxes.addObject(view);
        });
      });
    } else if (this.get('mode') == 'envelope') {
      var envtemplate = container.lookup("template:envelopes/" + this.get('envelope'));
      self.boxes.addObject(Ember.View.create({template: envtemplate, unicorn: unicorn}));
    } else
      throw new Error("Cannot handle the unicorn mode " + this.get('mode'));
  }
});

export default list;