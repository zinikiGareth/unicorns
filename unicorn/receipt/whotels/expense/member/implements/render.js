import MyTemplate from 'unicorn/receipt/whotels/expense/member/template';
import RenderContract from 'contract/render';

var render = RenderContract.implement({
    render: function() {
      return new Ember.RSVP.Promise(function (resolve) {
        resolve(Ember.View.create({template:MyTemplate}));
      });
    }
});

export default render;