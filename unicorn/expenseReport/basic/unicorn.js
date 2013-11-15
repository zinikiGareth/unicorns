import Unicorn from 'unicornlib/unicorn';
import Render from 'unicorn/expenseReport/basic/implements/render';
import Actor from 'unicorn/expenseReport/basic/actor/actor';
import CardMix from 'container/models/cardmix';

// TODO: I feel this should all be wrapped up in a function()

var actor = Actor.create();

var unicorn = Unicorn.extend({
  init: function() {
    this._super();
    actor.set('viewables', this.get('viewables'));
  },
  onLoad: function(cardmix) {
    var store = App.__container__.lookup('store:main');
    var serializer = App.__container__.lookup('serializer:-default');
    store.push(CardMix, cardmix);
    return store.find(CardMix, cardmix.id).then(function(cm) {
//    App.__container__.register("model:receipt", Receipt);
      actor.set('cardmix', cm);
//    actor.set('model', store.push(Receipt, {id: cardmix.data, total: 44.03, location: 'Las Vegas, NV'}));
    })
  },
  onConnect: function(proxy) {
    // The argument passed in here is a proxy back to the containing environment
    // We should be able to use this to call all of the contract methods that we should be guaranteed.
    // The promises should guarantee us that onLoad is called before we get here, and that rendering will
    // be held up until we resolve our promise.
    
    return Ember.RSVP.resolve(true);
    // NEXT STEP: make it so that we can call subscribe() to the data id from here ...
//    return proxy.restore.subscribe(this.get('cardmix.data')).when(function (r) {
//      console.log("Managed to get an updated version of data", r);
//    });
  },
  application: null,
  heart: null,
  viewables: Em.A(),
  actor: actor,
  implements: [Render]
}).create();

export default unicorn;