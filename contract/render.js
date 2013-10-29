import Unicorn from 'unicornlib/unicornlib';

var render = Unicorn.Contract.create({
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