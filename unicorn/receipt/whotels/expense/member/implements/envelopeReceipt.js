import ReceiptContract from 'contract/envelope/envelopeReceipt';
import EnvelopeReceipt from 'envelope/receipt';

var asReceipt = ReceiptContract.implement({
  show: function(env) {
    console.log('need to implement asReceipt.show()');
  },
  as: function() {
    return EnvelopeReceipt.create({ amount: this.get('actor.model.total') });
  }
});

export default asReceipt;
