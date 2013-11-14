import MyTemplate from 'unicorn/expenseReport/basic/report';
import RenderContract from 'contract/render';

var render = RenderContract.implement({
    render: function() {
      var self = this;
      return new Ember.RSVP.resolve(Ember.View.create({
        actor: self.get('actor'),

        // In the goring-sandbox case, we have inherited (somehow) a context
        // which enables us to find the "unicorn-list" component.
        // In the sandbox-goring case this fails and we get an exception which
        // requires us to specify this; however, this is still not adequate to
        // get viewable results, since we can no longer find the heart.

        // I'm not sure exactly what needs to happen here long term
//      context: {},
//      container: self.get('application').__container__,

        template:MyTemplate,
        heart:self.get('heart'),
        viewables:self.get('viewables')
      }));
    }
});

export default render;