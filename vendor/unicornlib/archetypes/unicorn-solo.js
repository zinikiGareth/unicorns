import Oasis from 'oasis';
import UnicornLib from 'unicornlib/unicornlib';
import UnicornSandbox from 'unicornlib/unicornSandbox';
import UnicornGoring from 'unicornlib/unicornGoring';
import UnicornEnvelope from 'unicornlib/unicornEnvelope';

var oasis = UnicornLib.oasis;

var solo = Ember.Component.extend({
  shown: null,
  
  init: function() {
    var self = this;
    this._super();
    var unicorn = this.get('unicorn');
    if (unicorn)
      this.show(unicorn);
  },
  
  show: function(unicorn) {
    var self = this;
    var container = this.get('container');
    
    UnicornLib.Util.embody(container, this.get('mode'), unicorn).then(function(hash) {
      self.set('shown', hash.viewable);
    });
  }
});

export default solo;