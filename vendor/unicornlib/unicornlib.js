import Oasis from 'oasis';
import Contract from 'unicornlib/contract';
import Coordinator from 'unicornlib/coordinator';
import Registry from 'unicornlib/registry';
import Unicorn from 'unicornlib/unicorn';
import Util from 'unicornlib/util';

var UnicornLib = Ember.Object.extend({
  init: function() {
    this._super();
    this.coordinator = Coordinator.create(),
    this.oasis = new Oasis();
    this.oasis.logger.enable();
    this.registry = new Registry();
    this.util = new Util(Oasis, this.oasis, this.coordinator, this.registry);
  }
});

export default UnicornLib;