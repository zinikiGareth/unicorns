import UnicornContainer from 'unicornlib/unicornContainer';

var unicornEnvelope = UnicornContainer.extend({
  init: function() {
    this._super();
    this.set('nestedView', Ember.View.create({template: this.get('template'), unicorn: this.get('unicorn') }));
  }
});

export default unicornEnvelope;