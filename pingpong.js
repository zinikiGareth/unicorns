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

var UnicornApp = Ember.Application.create({
  Resolver: Resolver,
  modulePrefix: 'container',
  LOG_TRANSITIONS: true,
  LOG_MODULE_RESOLVER: true
});
var container = UnicornApp.__container__;

var FredConsumer = Oasis.Consumer.extend({
  events: {
    load: function(hash) {
      var module = hash.module;
      console.log("requested module", module);
      var wrapper = container.lookup("unicorn:" + module);
      wrapper.promise.then(function(code) {
        code.unicorn = hash;
        code.render().then(function(view) {
          view.append();
        });
      });

    },
    ping: function() {
      console.log('consumer ping');
      this.send('pong');
    }
  },
  requests: {
    render: function() {
      console.log('consumer render');
      return "hello";
    }
  }
});

oasis.connect({
  consumers: {
    fred: FredConsumer
  }
})