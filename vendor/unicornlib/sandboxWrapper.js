var sandboxWrapper = Ember.View.extend({
  didInsertElement:function() {
    $(this.get('element')).append(this.get('sandbox').el);
  }
});

export default sandboxWrapper;