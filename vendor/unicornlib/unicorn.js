import Oasis from 'oasis';

var Unicorn = Ember.Object.extend({
  init: function() {
    var implArr = this.get('implements');
    for (var i=0;i<implArr.length;i++) {
      var item = implArr[i];
      for (var p in item)
        if (item.hasOwnProperty(p))
          this[p] = item[p];
    }
  },
  oasisSandboxConnector: function(bridge) {
    var self = this;
    var consumers = {};
    consumers['_load'] = Oasis.Consumer.extend({
      events: {
        load: function(hash) {
          console.log("in load");
          self.mainHash = hash;
          bridge.whenReady.resolve(self);
        }
      }
    });
    
    // just how special is actual render?
    consumers['_render'] = Oasis.Consumer.extend({
      requests: {
        render: function() {
          return new Oasis.RSVP.Promise(function(resolve) {
            bridge.whenReady.promise.then(function() {
              console.log('in actual render');
              self.unicorn = self.mainHash;
              self.render().then(function(view) {
                view.append();
                resolve(true);
              });
            });
          });
        }
      }
    });
    
    consumers['receiptEnvelope'] = Oasis.Consumer.extend({
      events: {
        show: function(arg) {
          bridge.whenReady.promise.then(function() {
            bridge.torso.show(arg);
          });
        }
      },
      requests: {
        as: function() {
          return new Oasis.RSVP.Promise(function(resolve) {
            bridge.whenReady.promise.then(function() {
              resolve(bridge.torso.as());
            });
          })
        }
      }
    })
    
    return {
      consumers: consumers
    };
  }
});

export default Unicorn;