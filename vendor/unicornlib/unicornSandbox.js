import SandboxWrapper from 'unicornlib/sandboxWrapper';
import UnicornContainer from 'unicornlib/unicornContainer';

var unicornSandbox = UnicornContainer.extend({
  init: function() {
    this._super();
    this.set('nestedView', SandboxWrapper.create({sandbox: this.get('sandbox')}));
  }
});

export default unicornSandbox;