var CardMix = DS.Model.extend({
  unicorn: DS.attr('string'), // the name of the unicorn file
  data: DS.attr('string') // the id of the data object
});

export default CardMix;