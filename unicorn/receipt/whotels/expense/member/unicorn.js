import Unicorn from 'unicornlib/unicorn';
import Render from 'unicorn/receipt/whotels/expense/member/implements/render';
import Receipt from 'unicorn/receipt/whotels/expense/member/implements/receiptEnvelope';

var unicorn = Unicorn.create({implements: [Render, Receipt]});

export default unicorn;