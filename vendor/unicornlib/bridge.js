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
//    Logger.enable();
    
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
    var uuid = this.getNamedParameter(window.location.href, "guid");

    this.app.UnicornLib.registry.set('uuid', uuid);
    
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
    this.app.UnicornLib.registry.set('ulService', this.oasis.consumers['_unicornlib']);
    // TODO: this may need yet more promise coordination with onLoad()
    if (module.onConnect)
      module.onConnect(this.oasis.consumers);
  };
  
  this.oasisSandboxConnector = function(module, impls) {
    var consumers = {};
    var bridge = this;
    // NOTE: this is duplicated with cloneChannel
    consumers['_unicornlib'] = Oasis.Consumer.extend({
      events: {
        load: function(cardmix) {
          if (module.onLoad)
            module.onLoad(cardmix).then(function() { bridge.whenReady.resolve(module); });
          else
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
              return module.render.render.apply(module).then(function(view) {
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
                bridge.torso[ii._name][p].apply(bridge.torso, argsArray);
              });
            };
          } else if (m.kind == 'report') {
            reqs[p] = function() {
              var argsArray = arguments;
              return bridge.whenReady.promise.then(function() {
                return bridge.torso[ii._name][p].apply(bridge.torso, argsArray);
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