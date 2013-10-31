/* This is starting out as the basic "pingpong" Oasis
 * example.  It needs to morph to:
 * 
 * 1. A bridge to the whotels receipt card
 * 2. A general purpose unicorn-as-card environment
 * 
 * This means it needs to become steadily more aware of both contracts
 * and the overall approach we're taking 
 */
var Logger = require('oasis/logger');
var Resolver = require('resolver');
Logger.enable();

console.log("in sandbox");
var UnicornApp = Ember.Application.create({
  Resolver: Resolver,
  modulePrefix: 'container',
  LOG_TRANSITIONS: true,
  LOG_MODULE_RESOLVER: true
});
var container = UnicornApp.__container__;

var wrapperP = Oasis.RSVP.defer();
var mainHash;
var LoadConsumer = Oasis.Consumer.extend({
  events: {
    load: function(hash) {
      mainHash = hash;
      var module = hash.module;
      console.log("requested module", module);
      wrapperP.resolve(container.lookup("unicorn:" + module));
    }
  }
});
var RenderConsumer = Oasis.Consumer.extend({
  requests: {
    render: function() {
      console.log('consumer render');
      wrapperP.promise.then(function(wrapper) {
        wrapper.promise.then(function(code) {
          code.unicorn = mainHash;
          code.render().then(function(view) {
            view.append();
          });
        });
      });
      return "hello";
    }
  }
});

oasis.connect({
  consumers: {
    load: LoadConsumer,
    render: RenderConsumer
  }
})