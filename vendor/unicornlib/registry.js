import Oasis from 'oasis';
 
var Registry = Ember.Object.extend({
  unicorns: {},
  services: {},
  
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
        resolve(['_unicornlib', 'render', 'envelopeReceipt']);
      else if (name === 'expenseReport/basic')
        resolve(['_unicornlib', 'render']);
      else
        reject("do not have info on " + name);
    }); 
  },
  
  registerService: function(contract, provider) {
    this.services[contract.name] = { contract: contract, provider: provider };
  },
  
  /** Based on a previously registered service, create a new Oasis connector pair
   * of client proxy and service proxy
   */
  provideService: function(name, opts) {
    var services = this.services;
    var coordinator = this.get('coordinator');
    return new Ember.RSVP.Promise(function(resolve, reject) {
      if (name === '_unicornlib') {
        // this is a special case ...
        var UnicornLibService = Oasis.Service.extend({
          initialize: function() {
            // TODO: we should probably use the serializer ...
            console.log("sending load");
            this.send('load', {id: opts.id});
          },
          events: {
            register: function(hash) {
              console.log("UnicornLib register called with ", hash);
              coordinator.register(hash.what, hash.guid);
            }
          }
        });
        resolve({service: UnicornLibService});
      } else if (services[name]) {
        var me = services[name];
        var ps = {};
        var os = me.contract.oasisService();
        ps.service = os.service;
        ps.client = me.contract.clientProxy(os.instance);
        resolve(ps);
      } else
        reject("There is no service called " + name);
    });
  }
});

export default Registry;