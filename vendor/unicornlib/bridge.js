/* This is starting out as the basic "pingpong" Oasis
 * example.  It needs to morph to:
 * 
 * 1. A bridge to the whotels receipt card
 * 2. A general purpose unicorn-as-card environment
 * 
 * This means it needs to become steadily more aware of both contracts
 * and the overall approach we're taking 
 */

import Oasis from 'oasis';
import Logger from 'oasis/logger';
import Resolver from 'resolver';

function Bridge() {
  this.init = function() {
    Logger.enable();
    
    this.oasis = new Oasis();
    this.oasis.autoInitializeSandbox();

    this.app = Ember.Application.create({
      Resolver: Resolver,
      modulePrefix: 'container',
      LOG_TRANSITIONS: true,
      LOG_MODULE_RESOLVER: true
    });
    
    this.container = this.app.__container__;
    this.whenReady = Oasis.RSVP.defer();
  };
  
  this.setup = function(module) {
    var self = this;
    this.torso = module;
    var LoadConsumer = Oasis.Consumer.extend({
      events: {
        load: function(hash) {
          console.log("in load");
          self.mainHash = hash;
          self.whenReady.resolve(self);
        }
      }
    });
    var RenderConsumer = Oasis.Consumer.extend({
      requests: {
        render: function() {
          console.log('consumer render');
          return new Oasis.RSVP.Promise(function(resolve) {
            self.whenReady.promise.then(function() {
              console.log('in actual render');
              self.torso.unicorn = self.mainHash;
              self.torso.render().then(function(view) {
                view.append();
                resolve(true);
              });
            });
          });
        }
      }
    });

    this.oasis.connect({
      consumers: {
        load: LoadConsumer,
        render: RenderConsumer
      }
    });
  };
  
  this.getModuleNameFromLocation = function(href, param) {
    var href = window.location.href;
    var param = href.indexOf('?' + param + '='); // should also check for '&='
    var moduleName = href.substring(param+9);
    param = moduleName.indexOf('&');
    if (param > 0)
      moduleName = moduleName.substring(0, param);
    return moduleName;
  };
}
export default Bridge;