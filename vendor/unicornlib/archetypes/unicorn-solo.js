import Oasis from 'oasis';
import UnicornLib from 'unicornlib/unicornlib';
import UnicornSandbox from 'unicornlib/unicornSandbox';
import UnicornGoring from 'unicornlib/unicornGoring';
import UnicornEnvelope from 'unicornlib/unicornEnvelope';

var oasis = App.oasis;

var solo = Ember.Component.extend({
  shown: null,
  
  init: function() {
    var self = this;
    this._super();
    var unicorn = this.get('unicorn');
    if (unicorn)
      this.show(unicorn);
  },
  
  show: function(unicorn) {
    var self = this;
    var container = this.get('container');
    
    // resolve promise (if any)
    if (unicorn instanceof Ember.RSVP.Promise) {
      unicorn.then(function(resolved) { self.show(resolved); });
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
      self.shown = UnicornSandbox.create({sandbox:hash.sandbox});

      // and ask it to render itself ...
      hash.horn.render.render();
    } else if (this.get('mode') == 'goring') {
      var name = unicorn.get('unicorn');
      var goring = container.lookup("unicorn:" + name);
      goring.promise.then(function(code) {
        code.unicorn = unicorn; // needed?  compare to "unicorn: ..." in UG creation below
        code.render().then(function(view) {
          self.set('shown', UnicornGoring.create({nestedView: view, unicorn: unicorn}));
        });
      });
    } else if (this.get('mode') == 'envelope') {
      var envtemplate = container.lookup("template:envelopes/" + this.get('envelope'));
      self.shown = UnicornEnvelope.create({template: envtemplate, unicorn: unicorn});
    } else
      throw new Error("Cannot handle the unicorn mode " + this.get('mode'));
  }
});

export default solo;