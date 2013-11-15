import UnicornSandbox from 'unicornlib/unicornSandbox';
import UnicornGoring from 'unicornlib/unicornGoring';
import UnicornEnvelope from 'unicornlib/unicornEnvelope';

function Util(Oasis, oasis, registry) {
  var RSVP = Oasis.RSVP;

  this.embody = function (emberContainer, mode, heartP, archetypeGuid) {
    var self = this;

    return RSVP.resolve(heartP).then(_embody);
     
    function _embody(heart) {
      mode = self.validateMode(heart, mode);
      var guid = Ember.generateGuid(null, "unicorn");
      registry.register('unicorn', guid);
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
          return App.UnicornLib.registry.getContractsFor(name).then(function (contracts) {
            // TODO: we need to create horn&mouth by calling Contract.clientProxy & Contract.sandboxProxy on the channels
            var horn = {};
            var mouth = {};
            var services = {};
            var promises = [];
            Em.A(contracts).forEach(function(c) {
              promises.push(registry.provideClonedChannelFor(c, heart).then(function(s) {
                services[c] = s.service;
                // TODO: fill in mouth with proxy-over-channel
                if (s.client)
                  horn[c] = s.client;
              }));
            });
            var promise;
            if (code.onLoad)
              promise = code.onLoad(heart);
            else
              promise = Ember.RSVP.resolve(true);
            if (code.onConnect)
              promise = promise.then(function() { debugger; code.onConnect(mouth); });
            return promise.then(function() {
              debugger;
              return code.render().then(function(view) {
                return UnicornGoring.create({
                  nestedView: view
                });
              });
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
      if (registry.inSandbox())
        mode = 'envelope';
    }
    
    return mode;
  };
  
  this.createOasisSandbox = function(name, heart, caps, guid, archetypeGuid) {
    var services = {};
    var promises = [];
    var horn = {};
    Em.A(caps).forEach(function(c) {
      promises.push(registry.provideOasisServiceFor(c, heart).then(function(s) {
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
      registry.registerSandbox(guid, sandbox);

      return UnicornSandbox.create({sandbox:sandbox, heart: heart, horn: horn, guid: guid, archetypeGuid: archetypeGuid});
    });
  }
};

export default Util;
