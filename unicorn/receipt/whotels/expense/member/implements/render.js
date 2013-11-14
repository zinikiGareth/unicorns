import MyTemplate from 'unicorn/receipt/whotels/expense/member/template';
import RenderContract from 'contract/render';

var render = RenderContract.implement({
    render: function() {
      var self = this;
      return new Ember.RSVP.resolve(Ember.View.create({
        template:MyTemplate,
        cardmix:self.get('actor.cardmix'),
        model:self.get('actor.model')
        // TODO: this was put it here as a test, but I don't really want to do it.
//      draggable: "true",
//      attributeBindings: ["draggable"],
//      dragStart:function(ev) {
//      console.log("drag start ", ev);
//      },
//      drag:function(ev) {
//      console.log("drag motion ", ev);
//      }
      }));
    }
});

export default render;