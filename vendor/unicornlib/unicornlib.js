import Oasis from 'oasis';
import Contract from 'unicornlib/contract';
import Coordinator from 'unicornlib/coordinator';
import Unicorn from 'unicornlib/unicorn';
import Util from 'unicornlib/util';

var UnicornLib = Ember.Object.extend({
  init: function() {
    this._super();
    this.coordinator = Coordinator.create(),
    this.oasis = new Oasis();
    this.util = new Util(Oasis, this.oasis, this.coordinator);
  }
});

export default UnicornLib;