import Unicorn from 'unicornlib/unicorn';
import Render from 'unicorn/expense-report/basic/implements/render';
import Actor from 'unicorn/expense-report/basic/actor/actor';

// TODO: I feel this should all be wrapped up in a function()

var actor = Actor.create();

var unicorn = Unicorn.extend({
  init: function() {
    this._super();
    this.addObserver('heart', function() {
      actor.set('heart', this.get('heart'));
    });
  },
  heart: null,
  actor: actor,
  implements: [Render]
}).create();

export default unicorn;