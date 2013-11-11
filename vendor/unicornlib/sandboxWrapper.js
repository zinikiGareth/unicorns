var sandboxWrapper = Ember.View.extend({
  didInsertElement:function() {
    Ember.$(this.get('element')).append(this.get('sandbox').el);
  },
  draggable: "true",
  style: "padding: 20px",
  attributeBindings: ["draggable", "style"],
  dragStart:function(ev) {
    // This "19" needs to possibly be more than this ...
    ev.dataTransfer.setData('unicornHeart', "19");
    // TODO: we also need to say what the container is that 
    // this is currently in.
    // Recommendation: send back some JSON Object such as:
    // { heart: "19", inside: "containerID", modifiers: isShiftDown }
    console.log("wrapper drag start", ev);
  },
});

export default sandboxWrapper;
