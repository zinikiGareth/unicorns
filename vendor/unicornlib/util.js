import UnicornSandbox from 'unicornlib/unicornSandbox';
import UnicornGoring from 'unicornlib/unicornGoring';
import UnicornEnvelope from 'unicornlib/unicornEnvelope';

function Util(Oasis, oasis) {
  this.embody = function(emberContainer, mode, heart) {
    var self = this;
    // resolve promise (if any)
    if (heart instanceof Ember.RSVP.Promise) {
      return new Ember.RSVP.Promise(function(resolver) {
        heart.then(function(resolved) { resolver(self.embody(mode, resolved)); });
      })
      return;
    }
    
    if (mode == 'sandbox') {
      var name = heart.get('unicorn');
      
      // somehow we need to get the list of unicorn capabilities
      // this can be inferred from the unicorn code, but we DO NOT want to load that here
      // Ideally, the tooling would have figured it out for us

      // At the very least we should be able to find from the resolver:
//      var contracts = container.lookup('capabilities:' + name);
      
      // for now, just hard code it ...
      var contracts = ['_load', '_render'];

      var hash = this.createOasisSandbox(name, heart, contracts);
      // and ask it to render itself ...
      hash.horn.render.render();
      return new Oasis.RSVP.Promise(function(resolver) {
        resolver(hash);
      });
    } else if (mode == 'goring') {
      var name = heart.get('unicorn');
      var goring = emberContainer.lookup("unicorn:" + name);
      return new Oasis.RSVP.Promise(function(resolver) {
        goring.promise.then(function(code) {
          code.heart = heart; // needed?  compare to "heart: ..." in UG creation below
          code.render().then(function(view) {
            // TODO: need "horn"
            resolver({viewable:UnicornGoring.create({nestedView: view, heart: heart})});
          });
        });
      });
    } else if (mode == 'envelope') {
      var envtemplate = emberContainer.lookup("template:envelopes/" + this.get('envelope'));
      var ret = UnicornEnvelope.create({template: envtemplate, heart: heart});
      // TODO: need some kind of "horn"
      return new Oasis.RSVP.Promise(function(resolver) { resolver({viewable: ret})});
    } else
      throw new Error("Cannot handle the unicorn mode " + this.get('mode'));
  };

  this.createOasisSandbox = function(name, heart, caps) {
    var LoadService = Oasis.Service.extend({
      initialize: function() {
        // TODO: we should probably use the serializer ...
        console.log("sending load");
        this.send('load', {module:name, id: heart.get('id')});
      }
    });
    
    var RenderContract = require('contract/render');
    var rshash = RenderContract.oasisService();
    var sandbox = oasis.createSandbox({
      type: 'html',
      url: 'unicornSandbox.html?unicorn=' + name,
      capabilities: ['_load','_render'],
      services: {
        _load: LoadService,
        _render: rshash.service
      }
    });

    var rc = RenderContract.clientProxy(rshash.instance);
    var horn = { render: rc };

    return { viewable: UnicornSandbox.create({sandbox:sandbox}), horn: horn };
  }
};

export default Util;