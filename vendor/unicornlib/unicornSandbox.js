import SandboxWrapper from 'unicornlib/sandboxWrapper';

var unicornSandbox = Ember.Object.extend({
  init: function() {
    this._super();
    this.set('nestedView', SandboxWrapper.create({sandbox: this.get('sandbox')}));
  }
});

export default unicornSandbox;