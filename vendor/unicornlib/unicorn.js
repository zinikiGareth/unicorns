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
    var LoadConsumer = Oasis.Consumer.extend({
      events: {
        load: function(hash) {
          console.log("in load");
          self.mainHash = hash;
          bridge.whenReady.resolve(self);
        }
      }
    });
    var RenderConsumer = Oasis.Consumer.extend({
      requests: {
        render: function() {
          console.log('consumer render');
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
    
    return {
      consumers: {
        load: LoadConsumer,
        render: RenderConsumer
      }
    };
  }
});

export default Unicorn;