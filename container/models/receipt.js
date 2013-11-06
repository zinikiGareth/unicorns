var Receipt = DS.Model.extend({
  unicorn: DS.attr('string'),
  amount: DS.attr('number')
});

export default Receipt;