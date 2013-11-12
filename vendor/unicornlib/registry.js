

var Registry = Ember.Object.extend({
  unicorns: {},
  
  find: function(name) {
    console.log("Finding " + name);
    if (this.unicorns[name])
      return this.unicorns[name];
    
    var path = "unicorn/" + name;
    console.log("Unicorn " + path + " requested");
    this.unicorns[name] = new Ember.RSVP.Promise(function(resolve, reject) {
      $.getScript("/" + path + "-amd.js").done(function(script, textStatus) {
        resolve(require(path + "/unicorn", null, null, true));
      }).fail(function() {
        console.log("could not resolve unicorn " + name);
        throw new Error("could not resolve unicorn " + name);
      });
    });
    return this.unicorns[name];
  },
  
  getContractsFor: function(name) {
    // somehow we need to get the list of unicorn capabilities
    // this can be inferred from the unicorn code, but we DO NOT want to load that here
    // Ideally, the tooling would have figured it out for us

    // for now, just hard code it ...

    return new Ember.RSVP.Promise(function(resolve, reject) {
      if (name === 'receipt/whotels/expense/member')
        resolve(['_load', '_render', 'receiptEnvelope']);
      else
        reject("do not have info on " + name);
    }); 
  }
});

export default Registry;