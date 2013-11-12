import Oasis from 'oasis';
var resolve =  Oasis.RSVP.resolve;

function createProxyMethod(channel, m, hash) {
  if (hash.kind == 'report') {
    return function() {
      var funArgs = arguments;
      if (arguments.length != hash.in.length)
        throw new Error("Incorrect # of args to proxy call for " + m + ", expected " + hash.in.length + " was " + arguments.length);

      return resolve(channel).then(function(ch){
        return ch.request(m, {args: funArgs});
      });
    }
  } else if (hash.kind == 'notify') {
    return function() {
      var funArgs = arguments;
      if (arguments.length != hash.in.length)
        throw new Error("Incorrect # of args to proxy call for " + m + ", expected " + hash.in.length + " was " + arguments.length);

      return resolve(channel).then(function(ch){
        return ch.send(m, {args: funArgs});
      });
    }
  }
}

var Contract = Ember.Object.extend({

  /** Call this method when you wish to provide the "card"-side implementation
   * of the contract
   */
  implement: function(impl) {
    var name = this.get('name');
    var ret = {};
    
    // Go through all the methods and check that impl has a valid implementation of them
    // "Valid" is hard to check ...
    var intf = this.get('methods');
    for (var m in intf)
      if (intf.hasOwnProperty(m)) {
        if (!impl[m])
          throw new Error("The implementation of " + name + " requires a '" + m + "' method");
        if (!(typeof impl[m] == 'function'))
          throw new Error("The method " + name + "." + m + " must be a function");
        if (impl[m].length != intf[m].in.length)
          throw new Error("The method " + name + "." + m + " must have " + intf[m].in.length + " arguments");
        ret[m] = impl[m];
      }
    return ret;
  },

  /** Call this method to create a "service" object that wraps the actual container-side
   * object.
   */
  oasisService: function() {
    // for now, I'm not putting anything in these, because they are for "INVOKE" and "GET" methods respectively
    var evhash = {};
    var reqhash = {};
    var defer = Oasis.RSVP.defer();
    var ret = Oasis.Service.extend({
      initialize: function() {
        defer.resolve(this);
      },
      events: evhash,
      requests: reqhash
    });
    return { service: ret, instance: defer.promise };
  },
  
  /** Create a proxy to be used in the container to reference the implementation in the sandbox
   */
  // channel is a "duck" that does the actual communication (or a promise to same)
  // all we know is it has send('name', argument) and request('name', argument)->Promise on it
  // In Oasis, it is the "Service" object
  clientProxy: function(channel) {
    var ret = {};
    var intf = this.get('methods');
    for (var m in intf)
      if (intf.hasOwnProperty(m)) {
        ret[m] = createProxyMethod(channel, m, intf[m]);
      }
    
    return ret;
  }
});

export default Contract;
