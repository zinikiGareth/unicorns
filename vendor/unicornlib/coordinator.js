/** Because of the distributed nature of the unicorns we're building,
 * there is a need for general "coordination" between them.  This happens here.
 * 
 * This object exists both in the containing environment and in each sandbox,
 * but the ones in the sandbox basically just set "containerAt" and then delegate
 * all their work upwards.
 * 
 * This class is also responsible for knowing whether it is inside a sandbox already or not
 * and acting appropriately.
 */
var Coordinator = Ember.Object.extend({
  containerAt: null, // if we are in a sandbox, this will be set to non-null in initialization
  sandboxes: {}, // if we are the containing environment, this is a hash of id -> sandbox
  objectRegister: {}, // hash of "type" => "id" => object, e.g. "unicorn" => id => unicorns

  /** Record "object" creation.  At the moment, the only objects we're interested in
   * are unicorns, but I'm sure there will be others.
   * 
   * This method ultimately invokes "registerTopLevel" in the containing environment, synthesizing
   * a third parameter which is its own sandbox id; if this is called from within the containing
   * environment, that is "null".
   */
  register: function(what, id) {
    console.log('registering', what, 'with id', id);
    if (this.get('containerAt')) {
      // if at lower level, delegate up through channel
      // TODO: we need an appropriate service, an event that can propagate up, and handlers
      // that enable it to call "registerTopLevel" with an appropriate sandbox
      throw new Error("Need to handle the case where we register unicorns inside sandboxes");
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
    if (this.get('containerAt'))
      throw new Error("Cannot register sandbox from within a sandbox; need to use goring or envelopes");
    this.sandboxes[id] = sandbox;
  }
});

export default Coordinator;
