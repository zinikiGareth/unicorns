import Unicorn from 'unicornlib/unicorn';
import Render from 'unicorn/expenseReport/basic/implements/render';
import Actor from 'unicorn/expenseReport/basic/actor/actor';

// TODO: I feel this should all be wrapped up in a function()

var actor = Actor.create();

var unicorn = Unicorn.extend({
  init: function() {
    this._super();
    actor.set('viewables', this.get('viewables'));
  },
  application: null,
  heart: null,
  viewables: Em.A(),
  actor: actor,
  implements: [Render]
}).create();

export default unicorn;