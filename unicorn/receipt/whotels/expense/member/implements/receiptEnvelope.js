import ReceiptContract from 'contract/envelope/envelopeReceipt';

var asReceipt = ReceiptContract.implement({
  show: function(env) {
    console.log('hello');
  },
  as: function() {
    console.log("as");
  }
});

export default asReceipt;
