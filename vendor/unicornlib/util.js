import UnicornSandbox from 'unicornlib/unicornSandbox';
import UnicornGoring from 'unicornlib/unicornGoring';
import UnicornEnvelope from 'unicornlib/unicornEnvelope';

function Util(Oasis, oasis, coordinator, registry) {
  var RSVP = Oasis.RSVP;

  this.embody = function (emberContainer, mode, heartP, archetypeGuid) {
    var self = this;

    return RSVP.resolve(heartP).then(_embody);
     
    function _embody(heart) {
      mode = self.validateMode(heart, mode);
      var guid = Ember.generateGuid(null, "unicorn");
      coordinator.register('unicorn', guid);
      if (mode === 'sandbox') {
        var name = heart.get('unicorn');
        
        return App.UnicornLib.registry.getContractsFor(name).then(function (contracts) {
          return self.createOasisSandbox(name, heart, contracts, guid, archetypeGuid).then (function (hash) {
            // and ask it to render itself ...
            hash.horn.render.render();
            return hash;
          });
        }).fail(function(msg) {
          console.log("Failed to create unicorn in sandbox: " + msg);
          throw new Error(msg);
        });
      } else if (mode === 'goring') {
        var name = heart.get('unicorn');
        var goring = App.UnicornLib.registry.find(name);
  
        return goring.then(function(code) {
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

  this.validateMode = function(heart, mode) {
    // the default mode is 'goring';
    // this gives maximum performance & flexibility, but will
    // auto-degrade to sandbox/envelope if the unicorn is not trusted
    if (!mode)
      mode = 'goring';
    
    // it is always OK to ask for 'envelope' mode
    if (mode === 'envelope')
      return mode;
    
    var name = heart.get('unicorn');
    
    // goring is only OK if this context trusts the new unicorn
    if (mode === 'goring') {
      if (!registry.trustUnicorn(name))
        mode = 'sandbox';
    }
    
    // sandbox is only OK if we are not already in a sandbox
    if (mode === 'sandbox') {
      if (coordinator.inSandbox())
        mode = 'envelope';
    }
    
    return mode;
  };
  
  this.createOasisSandbox = function(name, heart, caps, guid, archetypeGuid) {
    var services = {};
    var promises = [];
    var horn = {};
    Em.A(caps).forEach(function(c) {
      promises.push(registry.provideService(c, heart).then(function(s) {
        services[c] = s.service;
        if (s.client)
          horn[c] = s.client;
      }));
    });
    return Oasis.RSVP.all(promises).then(function() {
      var sandbox = oasis.createSandbox({
        type: 'html',
        url: 'unicornSandbox.html?unicorn=' + name + '&guid=' + guid,
        capabilities: caps,
        services: services
      });
      coordinator.registerSandbox(guid, sandbox);

      return UnicornSandbox.create({sandbox:sandbox, heart: heart, horn: horn, guid: guid, archetypeGuid: archetypeGuid});
    });
  }
};

export default Util;
