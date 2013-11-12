import Contract from 'unicornlib/contract';

var render = Contract.create({
  name: 'render',
  methods: {
    render: {
      kind: 'report',
      in: [],
      out: 'Ember.View'
    }
  }
});

export default render;