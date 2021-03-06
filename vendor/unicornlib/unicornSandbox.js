import SandboxWrapper from 'unicornlib/sandboxWrapper';
import UnicornContainer from 'unicornlib/unicornContainer';

var unicornSandbox = UnicornContainer.extend({
  init: function() {
    this._super();
    this.set('nestedView', SandboxWrapper.create({heart: this.get('heart'), sandbox: this.get('sandbox'), archetypeGuid: this.get('archetypeGuid') }));
  }
});

export default unicornSandbox;