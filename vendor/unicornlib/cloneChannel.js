
function CloneChannel(dest) {
  this.initialize = dest.initialize;
  this.events = dest.events;
  this.requests = dest.requests;
  
  this.send = function(cmd, obj) {
    Ember.run.once(this, cmd, Kamino.clone(obj));
  };
  this.request = function(cmd, obj) {
    return new Ember.RSVP.Promise(function (resolve) {
      resolve(this[cmd](Kamino.clone(obj)));
    })
  };
};
export default CloneChannel;