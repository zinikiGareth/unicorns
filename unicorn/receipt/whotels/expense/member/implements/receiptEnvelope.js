import ReceiptContract from 'contract/envelope/envelopeReceipt';
import ReceiptEnvelope from 'envelope/receipt';

var asReceipt = ReceiptContract.implement({
  show: function(env) {
    console.log('hello');
  },
  as: function() {
    console.log("as");
    return ReceiptEnvelope.create({amount: 33.62});
  }
});

export default asReceipt;
