var sandboxWrapper = Ember.View.extend({
  didInsertElement:function() {
    Ember.$(this.get('element')).append(this.get('sandbox').el);
  },
  draggable: "true",
  style: "border-left-style: solid; border-left-width: 20px;",
  attributeBindings: ["draggable", "style"],
  dragStart:function(ev) {
    ev.dataTransfer.setData('unicornHeart', JSON.stringify({ id: "19", unicorn: 'receipt', model: 'receipt' }));
    // TODO: we also need to say what the container is that 
    // this is currently in.
    // Recommendation: send back some JSON Object such as:
    // { heart: "19", inside: "containerID", modifiers: isShiftDown }
    console.log("wrapper drag start", ev);
  },
});

export default sandboxWrapper;
