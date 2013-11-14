var CardMix = DS.Model.extend({
  unicorn: DS.attr('string'), // the name of the unicorn file
  data: DS.attr('string'), // the id of the data object
  slot: DS.attr('string'), // the slot where we put this
  children: DS.hasMany('cardmix') // all the children
});

export default CardMix;