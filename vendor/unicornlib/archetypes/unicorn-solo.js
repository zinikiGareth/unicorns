import Oasis from 'oasis';
import UnicornSandbox from 'unicornlib/unicornSandbox';
import UnicornGoring from 'unicornlib/unicornGoring';
import UnicornEnvelope from 'unicornlib/unicornEnvelope';

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
    
    App.UnicornLib.util.embody(container, this.get('mode'), unicorn).then(function(viewable) {
      self.set('shown', viewable);
    });
  }
});

export default solo;