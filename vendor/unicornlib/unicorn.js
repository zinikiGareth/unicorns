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
    consumers['render'] = Oasis.Consumer.extend({
      requests: {
        render: function() {
          return bridge.whenReady.promise.then(function() {
            console.log('in actual render');
            self.unicorn = self.mainHash;
            return self.render().then(function(view) {
              view.append();
            });
          });
        }
      }
    });
    
    consumers['envelopeReceipt'] = Oasis.Consumer.extend({
      events: {
        show: function(arg) {
          bridge.whenReady.promise.then(function() {
            bridge.torso.show(arg);
          });
        }
      },
      requests: {
        as: function() {
          return bridge.whenReady.promise.then(function() {
            return bridge.torso.as();
          });
        }
      }
    })
    
    return {
      consumers: consumers
    };
  }
});

export default Unicorn;
