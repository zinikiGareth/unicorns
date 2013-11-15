import Oasis from 'oasis';
import CloneChannel from 'unicornlib/cloneChannel';
 
/**
 * This object exists both in the containing environment and in each sandbox,
 * but the ones in the sandbox basically just set "uuid" and then delegate
 * all their work upwards.
 * 
 * This class is also responsible for knowing whether it is inside a sandbox already or not
 * and acting appropriately.
 */
var Registry = Ember.Object.extend({
  unicorns: {},
  services: {},
  container: {},
  uuid: null, // if we are in a sandbox, this will be set to non-null in initialization
  sandboxes: {}, // if we are the containing environment, this is a hash of id -> sandbox
  objectRegister: {}, // hash of "type" => "id" => object, e.g. "unicorn" => id => unicorns
  
  /** Test if we are in a sandbox (otherwise at the top level)
   */
  inSandbox: function() {
    return !!this.get('uuid');
  },
  
  /** Record "object" creation.  At the moment, the only objects we're interested in
   * are unicorns, but I'm sure there will be others.
   * 
   * This method ultimately invokes "registerTopLevel" in the containing environment, synthesizing
   * a third parameter which is its own sandbox id; if this is called from within the containing
   * environment, that is "null".
   */
  register: function(what, id) {
    console.log('registering', what, 'with id', id);
    if (this.get('uuid')) {
      this.get('ulService').send('register', {what: what, guid: id, where: this.get('uuid')});
    } else
      // if at higher level, call other guy right now
      this.registerTopLevel(what, id, null);
  },
  registerTopLevel: function(what, id, where) { // call in container specifying where the object actually is (may be container or sandbox)
    if (!this.objectRegister[what])
      this.objectRegister[what] = { };
    this.objectRegister[what][id] = where;
  },
  
  /** When a new sandbox is created to house a unicorn, register it here so that we can connect to them
   * to update them on their location
   */
  registerSandbox: function(id, sandbox) {
    if (this.get('uuid'))
      throw new Error("Cannot register sandbox from within a sandbox; need to use goring or envelopes");
    this.sandboxes[id] = sandbox;
  },
  
  find: function(name) {
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
  
  /** Do we trust the unicorn enough to let it operate in goring mode?
   * This should be obtained from metadata as well ...
   */
  trustUnicorn: function(name) {
    return "expenseReport/basic" === name;
  },
  
  registerService: function(contract, provider) {
    this.services[contract.name] = { contract: contract, provider: provider };
  },
  
  /** Based on a previously registered service, create a new Oasis connector pair
   * of client proxy and service proxy
   */
  provideOasisServiceFor: function(name, opts) {
    return this.createServicePair(name, opts).then(function(pair) {
      return { client: pair.client, service: Oasis.Service.extend(pair.service) };
    });
  },
  
  provideClonedChannelFor: function(name, opts, code, bridge) {
    return this.createServicePair(name, opts).then(function(pair) {
      var service = new CloneChannel(name, pair.service, code, bridge);
      service.initialize();
      return { client: pair.client, service: service };
    });
  },
  
  /** Create the fundamental connection pair based on a communication channel
   */
  createServicePair: function(name, opts) {
    var services = this.services;
    var serializer = this.get('serializer');
    var self = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      if (name === '_unicornlib') {
        // this is a special case ...
        var UnicornLibService = {
          initialize: function() {
            var load = serializer.serialize(opts);
            load.id = opts.get('id');
            this.send('load', load);
          },
          events: {
            register: function(hash) {
              self.registerTopLevel(hash.what, hash.guid, hash.where);
            }
          }
        };
        // One day we will probably want a client
        resolve({client: null, service: UnicornLibService});
      } else if (services[name]) {
        var os = services[name].contract.oasisService();
        resolve({ client: services[name].contract.clientProxy(os.instance), service: os.service });
      } else
        reject("There is no service called " + name);
    });
  }
});

export default Registry;