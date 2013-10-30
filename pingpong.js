var Logger = requireModule('oasis/logger');
Logger.enable();

var FredConsumer = Oasis.Consumer.extend({
  events: {
    ping: function() {
      console.log('consumer ping');
      this.send('pong');
    }
  },
  requests: {
    render: function() {
      console.log('consumer render');
      return "hello";
    }
  }
});

oasis.connect({
  consumers: {
    fred: FredConsumer
  }
})