import UnicornLib from 'unicornlib/unicornlib';

var render = UnicornLib.Contract.create({
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