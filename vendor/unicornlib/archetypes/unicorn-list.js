import Oasis from 'oasis';
import UnicornLib from 'unicornlib/unicornlib';
import UnicornSandbox from 'unicornlib/unicornSandbox';
import UnicornGoring from 'unicornlib/unicornGoring';
import UnicornEnvelope from 'unicornlib/unicornEnvelope';

// TODO: create this somewhere else?
var oasis = new Oasis();

var list = Ember.Component.extend({
  boxes: Em.A(),
  
  init: function() {
    var self = this;
    this._super();
    var unicorns = this.get('unicorns');
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
  // To make matters worse, I am using "addObject" which doesn't seem to have an index,
  // but unlike "splice" does invoke the observers.  Presumably there is some Ember.Array method
  // that adds things at an index, but I'm not seeing it in the doc.
  // If we ever do need a short-term hack, we should just make sure that "boxes" is in
  // the same order as "unicorns" :-)
  addBoxFor: function(pos, unicorn) {
    var self = this;
    var container = this.get('container');
    
    // resolve promise (if any)
    if (unicorn instanceof Ember.RSVP.Promise) {
      unicorn.then(function(resolved) { self.addBoxFor(pos, resolved); });
      return;
    }

    // add to list of boxes for rendering
    if (this.get('mode') == 'sandbox') {
      var name = unicorn.get('unicorn');
      
      // somehow we need to get the list of unicorn capabilities
      // this can be inferred from the unicorn code, but we DO NOT want to load that here
      // Ideally, the tooling would have figured it out for us

      // At the very least we should be able to find from the resolver:
//      var contracts = container.lookup('capabilities:' + name);
      
      // for now, just hard code it ...
      var contracts = ['_load', '_render'];

      var hash = UnicornLib.Util.createOasisSandbox(container, oasis, name, unicorn, contracts);
      self.boxes.addObject(UnicornSandbox.create({sandbox:hash.sandbox}));

      // and ask it to render itself ...
      hash.horn.render.render();
    } else if (this.get('mode') == 'goring') {
      var name = unicorn.get('unicorn');
      var goring = container.lookup("unicorn:" + name);
      goring.promise.then(function(code) {
        code.unicorn = unicorn; // needed?  compare to "unicorn: ..." in UG creation below
        code.render().then(function(view) {
          self.boxes.addObject(UnicornGoring.create({nestedView: view, unicorn: unicorn}));
        });
      });
    } else if (this.get('mode') == 'envelope') {
      var envtemplate = container.lookup("template:envelopes/" + this.get('envelope'));
      self.boxes.addObject(UnicornEnvelope.create({template: envtemplate, unicorn: unicorn}));
    } else
      throw new Error("Cannot handle the unicorn mode " + this.get('mode'));
  }
});

export default list;