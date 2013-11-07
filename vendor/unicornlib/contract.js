import Oasis from 'oasis';

function createProxyMethod(channel, m, hash) {
  if (hash.kind == 'report') {
    return function() {
      var funArgs = arguments;
      if (arguments.length != hash.in.length)
        throw new Error("Incorrect # of args to proxy call for " + m + ", expected " + hash.in.length + " was " + arguments.length);
      if (channel instanceof Oasis.RSVP.Promise)
        return channel.then(function(ch) {
          ch.request(m, {args: funArgs});
        });
      else
        return channel.request(m, {args: funArgs});
    }
  } else if (hash.kind == 'notify') {
    return function() {
      var funArgs = arguments;
      if (arguments.length != hash.in.length)
        throw new Error("Incorrect # of args to proxy call for " + m + ", expected " + hash.in.length + " was " + arguments.length);
      if (channel instanceof Oasis.RSVP.Promise)
        channel.then(function(ch) {
          ch.send(m, {args: funArgs});
        });
      else
        channel.send(m, {args: funArgs});
    }
  }
}

var Contract = Ember.Object.extend({
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
  // create an oasis "service" object
  // need "Initialize", "events" and "requests"
  oasisService: function() {
    // for now, I'm not setting these up, because they are for "INVOKE" and "GET" methods respectively
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
  // channel is a "duck" that does the actual communication
  // all we know is it has send('name', argument) and request('name', argument)->Promise on it
  // In Oasis, it is the "Service" object
  // Note: it can be a promise
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