var Receipt = DS.Model.extend({
  location: DS.attr('location'),
  total: DS.attr('number')
});

export default Receipt;