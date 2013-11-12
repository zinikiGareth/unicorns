var sandboxWrapper = Ember.View.extend({

  // This is implicitly draggable
  draggable: "true",
  style: "border-left-style: solid; border-left-width: 20px;",
  attributeBindings: ["draggable", "style"],

  // when added to the DOM, insert the nested sandbox element
  didInsertElement:function() {
    Ember.$(this.get('element')).append(this.get('sandbox').el);
  },
  
  // when we start to drag this object, let the coordinator know
  dragStart:function(ev) {
    if (!this.get('archetypeGuid')) {
      ev.preventDefault();
      return;
    }
    ev.dataTransfer.setData('unicornHeart', JSON.stringify({ id: this.get('heart.id'), from: this.get('archetypeGuid'), unicorn: 'receipt', model: 'receipt' }));
  },
});

export default sandboxWrapper;
