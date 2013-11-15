
function CloneChannel(name, proxy, dest, bridge) {
  this.initialize = proxy.initialize;
  this.events = proxy.events;
  this.requests = proxy.requests;
  
  this.__dest = dest;
  // Note: this is duplicated with bridge
  dest['_unicornlib'] = {
    load: function(cardmix) {
      if (dest.onLoad)
        dest.onLoad(cardmix).then(function() { bridge.whenReady.resolve(dest); });
      else
        bridge.whenReady.resolve(dest);
    }
  };

  this.send = function(cmd, obj) {
    new Ember.RSVP.Promise(function(resolve) {
      resolve(dest[name][cmd].apply(dest, [Kamino.clone(obj)]));
    });
  };
  this.request = function(cmd, obj) {
    return new Ember.RSVP.Promise(function (resolve) {
      resolve(dest[name][cmd].apply(dest, [Kamino.clone(obj)]));
    })
  };
};
export default CloneChannel;