/* This is the bridge into the sandbox from the containing
 * environment.
 * 
 * On arrival here, we need to connect back to the original
 * service once the code is loaded.
 */

import Oasis from 'oasis';
import Logger from 'oasis/logger';
import Resolver from 'resolver';
import UnicornLib from 'unicornlib/unicornlib';

function Bridge() {
  this.init = function() {
    Logger.enable();
    
    var bridge = this;
    var Application = Ember.Application.extend({
      modulePrefix: 'container',
      Resolver: Resolver,
      UnicornLib : UnicornLib.create(),
    });
    
    var app = this.app = Application.create({});

    this.oasis = new Oasis();
    this.oasis.autoInitializeSandbox();
    
    var moduleName = this.getNamedParameter(window.location.href, "unicorn");
    console.log("unicorn is " + moduleName);
    var uuid = this.getNamedParameter(window.location.href, "guid");

    this.app.UnicornLib.coordinator.set('uuid', uuid);
    
    this.app.UnicornLib.registry.find(moduleName).then(function(unicorn) {
      unicorn.set('application', app);
      bridge.setup(unicorn);
    });

    this.container = this.app.__container__;
    this.whenReady = Oasis.RSVP.defer();

    return this.app;
  };
  
  /** This method is called when the code has been loaded.
   * The "thing that is loaded" should result in an object that was created
   * using "Unicorn.create(...)", thus the argument here should be a unicorn.
   */
  this.setup = function(module) {
    this.torso = module;
    this.oasis.connect(this.oasisSandboxConnector(module, module.get('implements')));
    this.app.UnicornLib.coordinator.set('ulService', this.oasis.consumers['_unicornlib']);
  };
  
  this.oasisSandboxConnector = function(module, impls) {
    var consumers = {};
    var bridge = this;
    consumers['_unicornlib'] = Oasis.Consumer.extend({
      events: {
        load: function(hash) {
          console.log("in load");
          module.mainHash = hash;
          bridge.whenReady.resolve(module);
        }
      }
    });

    // render, if defined, needs to be treated specially because we need to do "view.append"
    var rc = impls.findBy('_name', 'render');
    if (rc) {
      consumers['render'] = Oasis.Consumer.extend({
        requests: {
          render: function() {
            return bridge.whenReady.promise.then(function() {
              console.log('in actual render');
              module.unicorn = module.mainHash;
              return module.render().then(function(view) {
                view.append();
              });
            });
          }
        }
      });
    }
    
    impls.forEach(function(ii) {
      if (ii._name == 'render')
        return;
      var evs = {};
      var reqs = {};
      var methods = ii._contract.methods;
      for (var p in methods) {
        if (methods.hasOwnProperty(p)) {
          var m = methods[p];
          if (m.kind == 'notify') {
            evs[p] = function() {
              var argsArray = arguments;
              bridge.whenReady.promise.then(function() {
                bridge.torso[p].apply(bridge.torso, argsArray);
              });
            };
          } else if (m.kind == 'report') {
            reqs[p] = function() {
              var argsArray = arguments;
              return bridge.whenReady.promise.then(function() {
                return bridge.torso[p].apply(bridge.torso, argsArray);
              });
            };
          }
        }
      }
      consumers[ii._name] = Oasis.Consumer.extend({events: evs, requests: reqs});
    });
    
    return {
      consumers: consumers
    };
  }
  
  this.getNamedParameter = function(href, param) {
    var pos = href.indexOf('?' + param + '=');
    if (pos === -1)
      pos = href.indexOf('&' + param + '=');
    if (pos === -1)
      return null;
    var value = href.substring(pos+param.length+2);
    pos = value.indexOf('&');
    if (pos > 0)
      value = value.substring(0, pos);
    return value;
  };
}

export default Bridge;