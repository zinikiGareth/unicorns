import Oasis from 'oasis';
import RenderContract from 'contract/render';
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
    this.get('unicorns').addArrayObserver({
      arrayWillChange: function() {
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
      var LoadService = Oasis.Service.extend({
        initialize: function() {
          // TODO: we should probably use the serializer ...
          console.log("sending load");
          this.send('load', {module:name, id: unicorn.get('id')});
        }
      });
      
      var rshash = RenderContract.oasisService();
      var sandbox = oasis.createSandbox({
        oasisURL: 'unicornSandbox.html',
        url:'pingpong.js', 
        capabilities: ['load','render'],
        services: {
          load: LoadService,
          render: rshash.service
        }
      });
      self.boxes.addObject(UnicornSandbox.create({sandbox:sandbox}));

      var rc = RenderContract.clientProxy(rshash.instance);
      console.log("rendering");
      rc.render();
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