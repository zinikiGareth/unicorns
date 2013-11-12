

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
  }
});

export default Registry;