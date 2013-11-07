import ReceiptContract from 'contract/envelope/envelopeReceipt';
import ReceiptEnvelope from 'envelope/receipt';

var asReceipt = ReceiptContract.implement({
  show: function(env) {
    console.log('need to implement asReceipt.show()');
  },
  as: function() {
    return ReceiptEnvelope.create({amount: 33.62});
  }
});

export default asReceipt;
