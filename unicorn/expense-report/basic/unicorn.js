import Unicorn from 'unicornlib/unicorn';
import Render from 'unicorn/expense-report/basic/implements/render';

var unicorn = Unicorn.create({
  implements: [Render]
});

unicorn.set('figureTotal', 'hello');

export default unicorn;