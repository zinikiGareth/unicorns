import Oasis from 'oasis';
import Contract from 'unicornlib/contract';
import Unicorn from 'unicornlib/unicorn';
import Util from 'unicornlib/util';

var oasis = new Oasis();
var util = new Util(Oasis, oasis);

var UnicornLib = Ember.Namespace.create({
  Oasis: Oasis,
  oasis: oasis,
  Contract: Contract,
  Unicorn: Unicorn,
  Util: util
});

export default UnicornLib;