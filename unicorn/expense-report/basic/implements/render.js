import MyTemplate from 'unicorn/expense-report/basic/report';
import RenderContract from 'contract/render';

var render = RenderContract.implement({
    render: function() {
      var self = this;
      return new Ember.RSVP.Promise(function (resolve) {
        resolve(Ember.View.create({
          template:MyTemplate,
          unicorn:self.get('unicorn'),
        }));
      });
    }
});

export default render;