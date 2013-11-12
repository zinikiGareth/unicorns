import UnicornSandbox from 'unicornlib/unicornSandbox';
import UnicornGoring from 'unicornlib/unicornGoring';
import UnicornEnvelope from 'unicornlib/unicornEnvelope';

function Util(Oasis, oasis, coordinator) {
  var RSVP = Oasis.RSVP;

  this.embody = function (emberContainer, mode, heartP, archetypeGuid) {
    var self = this;

    return RSVP.resolve(heartP).then(_embody);
     
    function _embody(heart) {
      var guid = Ember.generateGuid(null, "unicorn");
      coordinator.register('unicorn', guid);
      if (mode === 'sandbox') {
        var name = heart.get('unicorn');
        
        // somehow we need to get the list of unicorn capabilities
        // this can be inferred from the unicorn code, but we DO NOT want to load that here
        // Ideally, the tooling would have figured it out for us
  
        // At the very least we should be able to find from the resolver:
        // var contracts = container.lookup('capabilities:' + name);
        
        // for now, just hard code it ...
        var contracts = ['_load', '_render', 'receiptEnvelope'];
  
        var hash = self.createOasisSandbox(name, heart, contracts, guid, archetypeGuid);
        // and ask it to render itself ...
        hash.horn.render.render();
        return hash;
      } else if (mode === 'goring') {
  
        var name = heart.get('unicorn');
        var goring = emberContainer.lookup("unicorn:" + name);
  
        return goring.promise.then(function(code) {
          // TODO: both of these are wrong ... we should implement & call the load contract
          // with the heart id & possibly "state" info
          code.set('heart', heart);
          return code.render().then(function(view) {
            // TODO: need "horn"
            return UnicornGoring.create({
              nestedView: view,
              heart: heart
            });
          });
        });
      } else if (mode === 'envelope') {
        var envtemplate = emberContainer.lookup("template:envelopes/" + self.get('envelope'));
        var ret = UnicornEnvelope.create({
          template: envtemplate,
          heart: heart
        });
        // TODO: need some kind of "horn"
        return ret;
      } else
        throw new Error("Cannot handle the unicorn mode " + self.get('mode'));
    }
  };

  this.createOasisSandbox = function(name, heart, caps, guid, archetypeGuid) {
    var LoadService = Oasis.Service.extend({
      initialize: function() {
        // TODO: we should probably use the serializer ...
        console.log("sending load");
        this.send('load', {module:name, id: heart.get('id')});
      }
    });
    
    var RenderContract = require('contract/render');
    var ReceiptContract = require('contract/envelope/envelopeReceipt');
    var rshash = RenderContract.oasisService();
    var erhash = ReceiptContract.oasisService();
    var sandbox = oasis.createSandbox({
      type: 'html',
      url: 'unicornSandbox.html?unicorn=' + name + '&guid=' + guid,
      capabilities: caps,
      services: {
        _load: LoadService,
        _render: rshash.service,
        receiptEnvelope: erhash.service
      }
    });
    coordinator.registerSandbox(guid, sandbox);

    var rc = RenderContract.clientProxy(rshash.instance);
    var envProxy = ReceiptContract.clientProxy(erhash.instance);
    var horn = { render: rc, receipt: envProxy };

    return UnicornSandbox.create({sandbox:sandbox, horn: horn, guid: guid, archetypeGuid: archetypeGuid});
  }
};

export default Util;
