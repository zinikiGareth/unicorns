import actor from 'actor/actor';

var ret = Unicorn.implement('required/init', 1, {
  actor: null,
  init: function(provider) {
    this.actor = actor.create({provider: provider});
    return new RVSP.Promise(actor.makeReady());
  }
});

export default ret;