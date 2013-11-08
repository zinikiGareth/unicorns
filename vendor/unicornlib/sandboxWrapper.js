var sandboxWrapper = Ember.View.extend({
  didInsertElement:function() {
    Ember.$(this.get('element')).append(this.get('sandbox').el);
  }
});

export default sandboxWrapper;
