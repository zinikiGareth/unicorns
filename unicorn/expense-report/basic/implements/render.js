import MyTemplate from 'unicorn/expense-report/basic/report';
import RenderContract from 'contract/render';

var render = RenderContract.implement({
    render: function() {
      var self = this;
      return new Ember.RSVP.Promise(function (resolve) {
        resolve(Ember.View.create({
          template:MyTemplate,
          heart:self.get('heart'),
          figureTotal: self.get('actor').get('figureTotal')
        }));
      });
    }
});

export default render;