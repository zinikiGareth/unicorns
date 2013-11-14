import MyTemplate from 'unicorn/expenseReport/basic/report';
import RenderContract from 'contract/render';

var render = RenderContract.implement({
    render: function() {
      var self = this;
      return new Ember.RSVP.Promise(function (resolve) {
        debugger;
        resolve(Ember.View.create({
          actor: self.get('actor'),
          container: self.get('application').__container__,
          context: {},
          template:MyTemplate,
          heart:self.get('heart'),
          viewables:self.get('viewables')
        }));
      });
    }
});

export default render;