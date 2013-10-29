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
  }
});

export default Contract;