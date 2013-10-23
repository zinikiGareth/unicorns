var UnicornController = Ember.ObjectController.extend({
  // Somebody needs to make a call as to how to render the unicorn.
  // This "feels" like a controller responsibility, but it probably needs outside help (e.g. are we already in a sandbox?)
  // For now, I'm just hacking this in here.
  mode: 'goring' // one of 'sandbox', 'modal', 'envelope', 'goring'
});

export default UnicornController;