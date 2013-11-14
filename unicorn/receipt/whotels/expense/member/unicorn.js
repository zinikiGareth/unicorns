import Unicorn from 'unicornlib/unicorn';
import Actor from 'unicorn/receipt/whotels/expense/member/actor/actor';
import Render from 'unicorn/receipt/whotels/expense/member/implements/render';
import Receipt from 'unicorn/receipt/whotels/expense/member/actor/receipt';
import EnvelopeReceipt from 'unicorn/receipt/whotels/expense/member/implements/envelopeReceipt';

var actor = Actor.create();

var unicorn = Unicorn.extend({
  onLoad: function(cardmix) {
    var store = App.__container__.lookup('store:main');
//    App.__container__.register("model:receipt", Receipt);
    actor.set('cardmix', cardmix);
    actor.set('model', store.push(Receipt, {id: cardmix.data, total: 44.03, location: 'Las Vegas, NV'}));
    return Ember.RSVP.resolve(true);
  },
  actor: actor,
  implements: [Render, EnvelopeReceipt]
}).create();

export default unicorn;