import MyTemplate from 'unicorn/expenseReport/basic/report';
import RenderContract from 'contract/render';

var render = RenderContract.implement({
    render: function() {
      var self = this;
      return new Ember.RSVP.Promise(function (resolve) {
        resolve(Ember.View.create({
          actor: self.get('actor'),

          // it is not clear to me why these need to be defined and it doesn't
          // happen automatically.
          // But in the sandbox-contains-goring case, this needs to be defined.
          context: {},
          container: self.get('application').__container__,
          
          template:MyTemplate,
          heart:self.get('heart'),
          viewables:self.get('viewables')
        }));
      });
    }
});

export default render;