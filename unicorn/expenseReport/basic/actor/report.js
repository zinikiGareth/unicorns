var Report = DS.Model.extend({
  unicorn: DS.attr('string'),
  contains: DS.hasMany('receipt'),
  total: DS.attr('number')
});

export default Report;