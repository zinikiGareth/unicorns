import Oasis from 'oasis';
import Contract from 'unicornlib/contract';
import Coordinator from 'unicornlib/coordinator';
import Registry from 'unicornlib/registry';
import Unicorn from 'unicornlib/unicorn';
import Util from 'unicornlib/util';

var UnicornLib = Ember.Object.extend({
  init: function() {
    this._super();
    this.oasis = new Oasis();
//    this.oasis.logger.enable();
    this.registry = Registry.create();
    this.coordinator = Coordinator.create({registry: this.registry}),
    this.util = new Util(Oasis, this.oasis, this.registry);
  }
});

export default UnicornLib;