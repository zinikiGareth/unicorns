import Contract from 'unicornlib/contract';

var receipt = Contract.create({
  name: 'envelopeReceipt',
  methods: {
    show: {
      kind: 'notify',
      in: ['Receipt']
    },
    as: {
      kind: 'report',
      in: [],
      out: 'Ember.View'
    }
  }
});

export default receipt;