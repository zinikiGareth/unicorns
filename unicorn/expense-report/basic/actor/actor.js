var actor = Ember.Object.extend({
  figureTotal: function() {
    var sum = 0;
    if (this.get('heart')) {
      this.get('heart').get('contains').forEach(function (m) {
        // TODO: actual sum; doing this requires "horns" too ...
        sum ++;
      });
    }
    return sum;
  }.property('heart.contains')
});

export default actor;