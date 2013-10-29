import MyTemplate from 'unicorn/receipt/whotels/expense/member/template';

var render = {
    render: function() {
      return new Ember.RSVP.Promise(function (resolve) {
        resolve(Ember.View.create({template:MyTemplate}));
      });
    }
};

export default render;